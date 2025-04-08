import uuid
from typing import Any
from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, col, delete, func, select
from sqlalchemy.orm import joinedload

from app import crud
from app.api.deps import (
    CurrentUser,
    SessionDep,
    get_current_user,
    get_db,
    get_current_active_superuser,
)
from app.core.config import settings
from app.core.security import get_password_hash, verify_password
from app.models import (
    Subscription,
    Message,
    UpdatePassword,
    User,
    UserCreate,
    UserPublic,
    UserRegister,
    UsersPublic,
    UserUpdate,
    UserUpdateMe,
    UserPreferencesUpdate,
    UserPreferences,
    UserPreferencesPublic,
    UserSession,
    UserSessionUpdate,
    UserSessionsReadResponse,
    UserSessionsCreateResponse,
    UserSessionsCreateData,
    UserSessionsCreateResponse,
)
from app.utils import generate_new_account_email, send_email, generate_confirmation_token

import logging
logging.basicConfig(level=logging.DEBUG)

router = APIRouter(prefix="/users", tags=["users"])
user_sessions_router = APIRouter(prefix="/users/user-sessions", tags=["user-sessions"])


@router.post("/signup", response_model=UserPublic)
def register_user(session: SessionDep, user_in: UserRegister) -> Any:
    """
    Create new user without the need to be logged in.
    """
    user = crud.get_user_by_email(session=session, email=user_in.email)
    if user:
        raise HTTPException(
            status_code=400,
            detail="The user with this email already exists in the system",
        )
    user_create = UserCreate.model_validate(user_in)
    user = crud.create_user(session=session, user_create=user_create)
    confirmation_token = generate_confirmation_token(email=user_in.email)
    email_data = generate_new_account_email(
        email_to=user.email, 
        username=user.email, 
        token=confirmation_token
    )
    send_email(
        email_to=user.email,
        subject=email_data.subject,
        html_content=email_data.html_content,
    )
    return user


@router.get(
    "/",
    dependencies=[Depends(get_current_active_superuser)],
    response_model=UsersPublic,
)
def read_users(session: SessionDep, skip: int = 0, limit: int = 100) -> Any:
    """
    Retrieve users.
    """

    count_statement = select(func.count()).select_from(User)
    count = session.exec(count_statement).one()

    statement = select(User).offset(skip).limit(limit)
    users = session.exec(statement).all()

    return UsersPublic(data=users, count=count)


@router.post(
    "/", dependencies=[Depends(get_current_active_superuser)], response_model=UserPublic
)
def create_user(*, session: SessionDep, user_in: UserCreate) -> Any:
    """
    Create new user.
    """
    user = crud.get_user_by_email(session=session, email=user_in.email)
    if user:
        raise HTTPException(
            status_code=400,
            detail="The user with this email already exists in the system.",
        )

    # Generate a temporary password if not provided
    if not user_in.password:
        import secrets
        user_in.password = secrets.token_urlsafe(12)
    
    # Set requires_password_change to true for users created by an admin
    user_in.requires_password_change = True
    
    user = crud.create_user(session=session, user_create=user_in)
    
    if settings.emails_enabled and user_in.email:
        confirmation_token = generate_confirmation_token(email=user_in.email)
        email_data = generate_new_account_email(
            email_to=user.email, 
            username=user.email, 
            token=confirmation_token
        )
        send_email(
            email_to=user.email,
            subject=email_data.subject,
            html_content=email_data.html_content,
        )
    return user


@router.patch("/me", response_model=UserPublic)
def update_user_me(
    *, session: SessionDep, user_in: UserUpdateMe, current_user: CurrentUser
) -> Any:
    """
    Update own user.
    """

    if user_in.email:
        existing_user = crud.get_user_by_email(session=session, email=user_in.email)
        if existing_user and existing_user.id != current_user.id:
            raise HTTPException(
                status_code=409, detail="User with this email already exists"
            )
    user_data = user_in.model_dump(exclude_unset=True)
    current_user.sqlmodel_update(user_data)
    session.add(current_user)
    session.commit()
    session.refresh(current_user)
    return current_user


@router.patch("/me/password", response_model=Message)
def update_password_me(
    *, session: SessionDep, body: UpdatePassword, current_user: CurrentUser
) -> Any:
    """
    Update own password.
    """
    if not verify_password(body.current_password, current_user.password_hash):
        raise HTTPException(status_code=400, detail="Incorrect password")
    if body.current_password == body.new_password:
        raise HTTPException(
            status_code=400, detail="New password cannot be the same as the current one"
        )
    password_hash = get_password_hash(body.new_password)
    current_user.password_hash = password_hash
    session.add(current_user)
    session.commit()
    return Message(message="Password updated successfully")


@router.get("/me", response_model=UserPublic)
def read_user_me(session: SessionDep, current_user: CurrentUser) -> Any:
    """
    Get current user.
    """
    # Get user with preferences
    user_with_preferences = session.get(User, current_user.id)
    
    # Ensure we have the latest data with preferences included
    if user_with_preferences:
        session.refresh(user_with_preferences)
        return user_with_preferences
    
    return current_user


@router.delete("/me", response_model=Message)
def delete_user_me(session: SessionDep, current_user: CurrentUser) -> Any:
    """
    Delete own user.
    """
    if current_user.is_superuser:
        raise HTTPException(
            status_code=403, detail="Super users are not allowed to delete themselves"
        )
    statement = delete(Subscription).where(col(Subscription.owner_id) == current_user.id)
    session.exec(statement)  # type: ignore
    session.delete(current_user)
    session.commit()
    return Message(message="User deleted successfully")


@router.patch("/me/preferences", response_model=UserPreferencesPublic)
def update_user_preferences(
    *, session: SessionDep, preferences_in: UserPreferencesUpdate, current_user: CurrentUser
) -> Any:
    """
    Update current user preferences.
    """
    # Get the user with preferences
    user = session.get(User, current_user.id)
    
    # Check if user has preferences
    if not user.preferences:
        # Create new preferences
        preferences_data = preferences_in.model_dump(exclude_unset=True)
        # Remove user_id if it's provided, as we'll set it to the current user's ID
        if 'user_id' in preferences_data:
            del preferences_data['user_id']
            
        preferences = UserPreferences(
            user_id=user.id,
            **preferences_data
        )
        session.add(preferences)
    else:
        # Update existing preferences
        preferences_data = preferences_in.model_dump(exclude_unset=True)
        # Remove user_id if it's provided, as we don't want to change the owner
        if 'user_id' in preferences_data:
            del preferences_data['user_id']
            
        for key, value in preferences_data.items():
            setattr(user.preferences, key, value)
        user.preferences.updated_at = datetime.utcnow()
    
    session.commit()
    session.refresh(user)
    return user.preferences


@router.get("/user-sessions", response_model=UserSessionsReadResponse)
def read_user_sessions(
    session: SessionDep,
    current_user: CurrentUser,
) -> Any:
    """
    Get all sessions for the current user.
    """
    statement = select(UserSession).where(UserSession.user_id == current_user.id)
    sessions = session.exec(statement).all()
    return UserSessionsReadResponse(sessions=sessions)


@router.post("/user-sessions", response_model=UserSessionsCreateResponse)
def create_user_session(
    *,
    session: SessionDep,
    session_in: UserSessionsCreateData,
    current_user: CurrentUser,
) -> Any:
    """
    Create a new session for the current user.
    """
    # Set all existing sessions to not current
    statement = select(UserSession).where(UserSession.user_id == current_user.id)
    existing_sessions = session.exec(statement).all()
    for existing_session in existing_sessions:
        existing_session.is_current = False
    
    # Create new session
    new_session = UserSession(
        user_id=current_user.id,
        device_name=session_in.requestBody.device_name,
        device_type=session_in.requestBody.device_type,
        device_ip=session_in.requestBody.device_ip,
        location=session_in.requestBody.location,
        is_current=True,
    )
    session.add(new_session)
    session.commit()
    session.refresh(new_session)
    return new_session


@router.put("/user-sessions", response_model=UserSessionsCreateResponse)
def update_current_session(
    *,
    session: SessionDep,
    session_in: UserSessionUpdate,
    current_user: CurrentUser,
) -> Any:
    """
    Update the current session for the user.
    """
    # Set all sessions to not current
    statement = select(UserSession).where(UserSession.user_id == current_user.id)
    existing_sessions = session.exec(statement).all()
    for existing_session in existing_sessions:
        existing_session.is_current = False
    
    # Set the specified session as current
    target_session = session.get(UserSession, session_in.session_id)
    if not target_session or target_session.user_id != current_user.id:
        raise HTTPException(
            status_code=404,
            detail="Session not found",
        )
    target_session.is_current = True
    session.add(target_session)
    session.commit()
    session.refresh(target_session)
    return target_session


@router.get("/{user_id}", response_model=UserPublic)
def read_user_by_id(
    user_id: uuid.UUID, session: SessionDep, current_user: CurrentUser
) -> Any:
    """
    Get a specific user by id.
    """
    user = session.get(User, user_id)
    if user == current_user:
        return user
    if not current_user.is_superuser:
        raise HTTPException(
            status_code=403,
            detail="The user doesn't have enough privileges",
        )
    return user


@router.patch(
    "/{user_id}",
    dependencies=[Depends(get_current_active_superuser)],
    response_model=UserPublic,
)
def update_user(
    *,
    session: SessionDep,
    user_id: uuid.UUID,
    user_in: UserUpdate,
) -> Any:
    """
    Update a user.
    """

    db_user = session.get(User, user_id)
    if not db_user:
        raise HTTPException(
            status_code=404,
            detail="The user with this id does not exist in the system",
        )
    if user_in.email:
        existing_user = crud.get_user_by_email(session=session, email=user_in.email)
        if existing_user and existing_user.id != user_id:
            raise HTTPException(
                status_code=409, detail="User with this email already exists"
            )

    db_user = crud.update_user(session=session, db_user=db_user, user_in=user_in)
    return db_user


@router.delete("/{user_id}", dependencies=[Depends(get_current_active_superuser)])
def delete_user(
    session: SessionDep, current_user: CurrentUser, user_id: uuid.UUID
) -> Message:
    """
    Delete a user.
    """
    user = session.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Prevent deletion of admin users
    if user.is_admin:
        raise HTTPException(
            status_code=403, detail="Admin users cannot be deleted"
        )
    
    # Delete user sessions first
    statement = delete(UserSession).where(col(UserSession.user_id) == user_id)
    session.exec(statement)  # type: ignore
    
    # Delete user subscriptions
    statement = delete(Subscription).where(col(Subscription.user_id) == user_id)
    session.exec(statement)  # type: ignore
    
    # Delete user preferences if they exist
    if user.preferences:
        session.delete(user.preferences)
    
    # Now delete the user
    session.delete(user)
    session.commit()
    return Message(message="User deleted successfully")
