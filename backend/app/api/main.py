from fastapi import APIRouter

from app.api.routes import auth, subscriptions, private, users, utils
from app.core.config import settings

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth")
api_router.include_router(users.router)
api_router.include_router(utils.router)
api_router.include_router(subscriptions.router)


if settings.ENVIRONMENT == "local":
    api_router.include_router(private.router)
