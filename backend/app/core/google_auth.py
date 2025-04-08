from typing import Any, Dict
import os

from google.oauth2 import id_token
from google.auth.transport import requests
from google_auth_oauthlib.flow import Flow
from fastapi import HTTPException

from app.core.config import settings

# Allow insecure transport for local development
os.environ["OAUTHLIB_INSECURE_TRANSPORT"] = "1"


def create_google_oauth_flow() -> Flow:
    """Create a Google OAuth flow instance."""
    if not all([settings.GOOGLE_CLIENT_ID, settings.GOOGLE_CLIENT_SECRET, settings.GOOGLE_REDIRECT_URI]):
        raise HTTPException(
            status_code=500,
            detail="Google OAuth settings are not properly configured"
        )
    
    # Create a simple client config without redirect_uris
    client_config = {
        "client_id": settings.GOOGLE_CLIENT_ID,
        "client_secret": settings.GOOGLE_CLIENT_SECRET,
        "auth_uri": "https://accounts.google.com/o/oauth2/auth",
        "token_uri": "https://oauth2.googleapis.com/token",
    }
    
    # Create the flow with explicit redirect_uri
    flow = Flow.from_client_config(
        {"web": client_config},
        scopes=[
            "openid",
            "https://www.googleapis.com/auth/userinfo.email",
            "https://www.googleapis.com/auth/userinfo.profile",
        ],
        redirect_uri=settings.GOOGLE_REDIRECT_URI
    )
    
    return flow


def verify_google_token(token: str) -> Dict[str, Any]:
    """Verify a Google ID token and return the user info."""
    try:
        idinfo = id_token.verify_oauth2_token(
            token, requests.Request(), settings.GOOGLE_CLIENT_ID
        )

        if idinfo["iss"] not in ["accounts.google.com", "https://accounts.google.com"]:
            raise ValueError("Wrong issuer.")

        return idinfo
    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid Google token: {str(e)}"
        ) 