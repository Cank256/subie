import uuid
from pydantic import EmailStr
from sqlmodel import Field, Relationship, SQLModel, Column, JSON
from typing import Optional, List
from datetime import datetime, date


# ------------------------------- User Models -------------------------------

# Shared properties for User
class UserBase(SQLModel):
    full_name:  str | None = Field(default=None, max_length=255)
    email: EmailStr = Field(unique=True, index=True, max_length=255)
    is_active: bool = Field(default=True)
    is_verified: bool = Field(default=False)
    is_superuser: bool = Field(default=False)
    plan_id: Optional[uuid.UUID] = Field(foreign_key="plan.id", default=None, nullable=True)


# Properties to receive via API on user creation
class UserCreate(UserBase):
    password: str = Field(min_length=8, max_length=40)


# User Registration for social login
class UserRegister(SQLModel):
    email: EmailStr = Field(max_length=255)
    password: str = Field(min_length=8, max_length=40)
    full_name: str | None = Field(default=None, max_length=255)
    social_login: bool = Field(default=False)
    social_login_provider: Optional[str] = Field(default=None, max_length=50)
    social_login_id: Optional[str] = Field(default=None, max_length=255)
    plan_id: Optional[uuid.UUID] = Field(foreign_key="plan.id", default=None, nullable=True)


# Properties to receive via API on user update
class UserUpdate(UserBase):
    email: Optional[EmailStr] = Field(default=None, max_length=255)
    password: Optional[str] = Field(default=None, min_length=8, max_length=40)


# User profile update for the current user
class UserUpdateMe(SQLModel):
    full_name: Optional[str] = Field(default=None, max_length=255)
    email: Optional[EmailStr] = Field(default=None, max_length=255)


# Password update for a user
class UpdatePassword(SQLModel):
    current_password: str = Field(min_length=8, max_length=40)
    new_password: str = Field(min_length=8, max_length=40)


# Database model for User
class User(UserBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    password_hash: str
    subscriptions: List["Subscription"] = Relationship(back_populates="user")
    settings: "UserSettings" = Relationship(back_populates="user")
    notifications: List["Notification"] = Relationship(back_populates="user")
    audit_logs: List["AuditLog"] = Relationship(back_populates="user")


# Public properties for User
class UserPublic(UserBase):
    id: uuid.UUID
    email: EmailStr
    full_name: str


# Public properties for Users
class UsersPublic(SQLModel):
    data: list[UserPublic]
    count: int


# ------------------------------- Plan Models -------------------------------

# Shared properties for Plan
class PlanBase(SQLModel):
    name: str = Field(index=True, max_length=255)
    description: Optional[str] = Field(default=None, max_length=500)
    price: float = Field(default=0.0)
    duration_in_days: int = Field(default=365)
    is_active: bool = Field(default=True)


# Database model for Plan
class Plan(PlanBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)


# ------------------------------- Subscription Models -------------------------------

# Database model for Subscription
class SubscriptionBase(SQLModel):
    user_id: uuid.UUID = Field(foreign_key="user.id", nullable=False)
    plan_name: str | None = Field(default=None, min_length=1, max_length=100)
    description: Optional[str] | None = Field(default=None, max_length=255)
    price: Optional[float] | None = Field(default=None, ge=0)
    start_date: datetime = Field(default_factory=datetime.utcnow)
    end_date: datetime
    is_active: bool = Field(default=True)

class SubscriptionCreate(SubscriptionBase):
    user_id: uuid.UUID

class SubscriptionUpdate(SQLModel):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    plan_name: str | None = Field(default=None, min_length=1, max_length=100)
    description: Optional[str] | None = Field(default=None, max_length=255)
    price: float | None = Field(default=None, ge=0)
    start_date: datetime | None = None
    end_date: datetime | None = None

class Subscription(SubscriptionBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    user_id: uuid.UUID = Field(foreign_key="user.id", nullable=False, ondelete="CASCADE")
    user: Optional["User"] = Relationship(back_populates="subscriptions")

class SubscriptionPublic(SubscriptionBase):
    id: uuid.UUID
    user_id: uuid.UUID

class SubscriptionsPublic(SQLModel):
    data: List[SubscriptionPublic]
    count: int


# ------------------------------- User Settings Models -------------------------------

class UserSettings(SQLModel, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    user_id: uuid.UUID = Field(foreign_key="user.id", nullable=False, ondelete="CASCADE")
    user: User = Relationship(back_populates="settings")
    dark_mode_enabled: bool = Field(default=False)
    preferred_language: str = Field(default="en")
    preferred_currency: str = Field(default="USD")
    notifications_enabled: bool = Field(default=True)
    notification_types: List[str] = Field(
        default=["email", "sms", "push"], sa_column=Column(JSON)
    )
    notify_before: int = Field(default=15)  # Notify user before x days



# ------------------------------- Notification Models -------------------------------

class Notification(SQLModel, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    user_id: uuid.UUID = Field(foreign_key="user.id", nullable=False, ondelete="CASCADE")
    user: User = Relationship(back_populates="notifications")
    message: str = Field(max_length=255)
    is_read: bool = Field(default=False)


# ------------------------------- Discount Models -------------------------------

class Discount(SQLModel, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    plan_id: uuid.UUID = Field(foreign_key="plan.id", nullable=False, ondelete="CASCADE")
    name: str = Field(max_length=255)
    code: str = Field(max_length=50, unique=True)
    type: str = Field(max_length=50)  # Discount type: fixed or percentage
    description: Optional[str] = Field(default=None, max_length=255)
    discount: float = Field(default=0)
    expired_at: datetime


# ------------------------------- Audit Log Models -------------------------------

class AuditLog(SQLModel, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    user_id: uuid.UUID = Field(foreign_key="user.id", nullable=False, ondelete="CASCADE")
    user: User = Relationship(back_populates="audit_logs")
    action: str = Field(max_length=255)
    timestamp: datetime = Field(default_factory=datetime.utcnow)


# ------------------------------- Token Models -------------------------------

class Token(SQLModel):
    access_token: str
    token_type: str = "bearer"


class TokenPayload(SQLModel):
    sub: Optional[str] = None


# ------------------------------- Password Reset Models -------------------------------

class NewPassword(SQLModel):
    token: str
    new_password: str = Field(min_length=8, max_length=40)


# Generic message
class Message(SQLModel):
    message: str