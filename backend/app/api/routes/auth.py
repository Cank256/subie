from datetime import timedelta
from typing import Annotated, Any

from fastapi import APIRouter, Depends, HTTPException, Request
from fastapi.responses import HTMLResponse, RedirectResponse
from fastapi.security import OAuth2PasswordRequestForm

from app import crud
from app.api.deps import CurrentUser, SessionDep, get_current_active_superuser
from app.core import security
from app.core.config import settings
from app.core.google_auth import create_google_oauth_flow, verify_google_token
from app.core.security import get_password_hash
from app.models import Message, NewPassword, Token, UserPublic, UserRegister, UserCreate
from app.utils import (
    generate_password_reset_token,
    generate_reset_password_email,
    send_email,
    verify_password_reset_token,
    generate_new_account_email,
    generate_confirmation_token,
    generate_confirmation_email,
)

router = APIRouter(tags=["login"])


@router.post("/access-token")
def login_access_token(
    session: SessionDep, form_data: Annotated[OAuth2PasswordRequestForm, Depends()]
) -> Token:
    """
    OAuth2 compatible token login, get an access token for future requests
    """
    user = crud.authenticate(
        session=session, email=form_data.username, password=form_data.password
    )
    if not user:
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    elif not user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")
    elif not user.is_verified:
        raise HTTPException(status_code=400, detail=[{"message": "Email not verified", "email": user.email}])
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    return Token(
        access_token=security.create_access_token(
            user.id, expires_delta=access_token_expires
        ),
        token_type="bearer",
        expiry=settings.ACCESS_TOKEN_EXPIRE_MINUTES
    )


@router.post("/resend-confirmation")
def resend_confirmation(session: SessionDep, email: str) -> Message:
    """
    Resend confirmation email
    """
    user = crud.get_user_by_email(session=session, email=email)
    if not user:
        raise HTTPException(status_code=400, detail="User not found")
    confirmation_token = generate_confirmation_token(email=email)
    email_data = generate_confirmation_email(
        email_to=user.email, 
        username=user.email, 
        token=confirmation_token
    )
    send_email(
        email_to=user.email,
        subject=email_data.subject,
        html_content=email_data.html_content,
    )
    return Message(message="Confirmation email sent")


@router.post("/confirm-email/{token}")
def confirm_email(token: str, session: SessionDep) -> Message:
    """
    Confirm email
    """
    email = verify_password_reset_token(token=token)
    if not email:
        raise HTTPException(status_code=400, detail="Invalid token")
    user = crud.get_user_by_email(session=session, email=email)
    if not user:
        raise HTTPException(status_code=400, detail="User not found")
    user.is_verified = True
    session.add(user)
    session.commit()
    
    # Return a message indicating whether the user needs to change their password
    if user.requires_password_change:
        return Message(message="Email confirmed. Password change required.")
    return Message(message="Email confirmed.")


@router.post("/setup-password/")
def setup_password(session: SessionDep, body: NewPassword) -> Message:
    """
    Set up password after email confirmation
    """
    email = verify_password_reset_token(token=body.token)
    if not email:
        raise HTTPException(status_code=400, detail="Invalid token")
    user = crud.get_user_by_email(session=session, email=email)
    if not user:
        raise HTTPException(
            status_code=404,
            detail="The user with this email does not exist in the system.",
        )
    elif not user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")
    elif not user.is_verified:
        raise HTTPException(status_code=400, detail="Email not verified")
    
    hashed_password = get_password_hash(password=body.new_password)
    user.password_hash = hashed_password
    session.add(user)
    session.commit()
    return Message(message="Password set up successfully")


@router.post("/test-token", response_model=UserPublic)
def test_token(current_user: CurrentUser) -> Any:
    """
    Test access token
    """
    return current_user


@router.post("/password-recovery/{email}")
def recover_password(email: str, session: SessionDep) -> Message:
    """
    Password Recovery
    """
    user = crud.get_user_by_email(session=session, email=email)

    if not user:
        raise HTTPException(
            status_code=404,
            detail="The user with this email does not exist in the system.",
        )
    password_reset_token = generate_password_reset_token(email=email)
    email_data = generate_reset_password_email(
        email_to=user.email, email=email, token=password_reset_token
    )
    send_email(
        email_to=user.email,
        subject=email_data.subject,
        html_content=email_data.html_content,
    )
    return Message(message="Password recovery email sent")


@router.post("/reset-password/")
def reset_password(session: SessionDep, body: NewPassword) -> Message:
    """
    Reset password
    """
    email = verify_password_reset_token(token=body.token)
    if not email:
        raise HTTPException(status_code=400, detail="Invalid token")
    user = crud.get_user_by_email(session=session, email=email)
    if not user:
        raise HTTPException(
            status_code=404,
            detail="The user with this email does not exist in the system.",
        )
    elif not user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")
    hashed_password = get_password_hash(password=body.new_password)
    user.password_hash = hashed_password
    session.add(user)
    session.commit()
    return Message(message="Password updated successfully")


@router.post(
    "/password-recovery-html-content/{email}",
    dependencies=[Depends(get_current_active_superuser)],
    response_class=HTMLResponse,
)
def recover_password_html_content(email: str, session: SessionDep) -> Any:
    """
    HTML Content for Password Recovery
    """
    user = crud.get_user_by_email(session=session, email=email)

    if not user:
        raise HTTPException(
            status_code=404,
            detail="The user with this username does not exist in the system.",
        )
    password_reset_token = generate_password_reset_token(email=email)
    email_data = generate_reset_password_email(
        email_to=user.email, email=email, token=password_reset_token
    )

    return HTMLResponse(
        content=email_data.html_content, headers={"subject:": email_data.subject}
    )


@router.get("/google/login")
async def google_login() -> RedirectResponse:
    """
    Redirect to Google OAuth login page
    """
    flow = create_google_oauth_flow()
    authorization_url, _ = flow.authorization_url(
        access_type="offline",
        include_granted_scopes="true",
        prompt="consent"
    )
    return RedirectResponse(authorization_url)


@router.get("/google/callback")
async def google_callback(request: Request, session: SessionDep) -> RedirectResponse:
    """
    Handle Google OAuth callback
    """
    flow = create_google_oauth_flow()
    
    # Get the full URL including query parameters
    full_url = str(request.url)
    
    # For local development, ensure we're using http
    if "localhost" in request.url.netloc:
        full_url = full_url.replace("https://", "http://")
    
    try:
        # Set the environment variable for this request
        import os
        os.environ["OAUTHLIB_INSECURE_TRANSPORT"] = "1"
        
        # Ignore scope mismatch errors
        os.environ["OAUTHLIB_RELAX_TOKEN_SCOPE"] = "1"
        
        flow.fetch_token(authorization_response=full_url)
    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=f"Failed to fetch token: {str(e)}"
        )
    
    credentials = flow.credentials
    id_info = verify_google_token(credentials.id_token)
    
    email = id_info["email"]
    user = crud.get_user_by_email(session=session, email=email)
    
    if not user:
        # Create new user
        user_data = UserCreate(
            email=email,
            password=credentials.id_token,  # Use token as password
            first_name=id_info.get("given_name"),
            last_name=id_info.get("family_name"),
            avatar_url=id_info.get("picture"),
            social_login=True,
            social_login_provider="google",
            social_login_id=id_info["sub"],
            is_verified=True,  # Google accounts are pre-verified
        )
        user = crud.create_user(session=session, user_create=user_data)
    elif not user.social_login:
        # Link existing account with Google
        user.social_login = True
        user.social_login_provider = "google"
        user.social_login_id = id_info["sub"]
        user.is_verified = True
        session.add(user)
        session.commit()
    
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = security.create_access_token(
        user.id, expires_delta=access_token_expires
    )
    
    # Redirect to the frontend with the access token
    frontend_url = settings.FRONTEND_HOST
    return RedirectResponse(
        url=f"{frontend_url}/auth/google/callback?access_token={access_token}"
    )
