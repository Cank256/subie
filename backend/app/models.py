import uuid
from pydantic import EmailStr
from sqlmodel import Field, Relationship, SQLModel, Column, JSON
from typing import Optional, List
from datetime import datetime


# ------------------------------- User Models -------------------------------

# Shared properties for User
class UserBase(SQLModel):
    first_name:  str | None = Field(default=None, max_length=255)
    last_name:  str | None = Field(default=None, max_length=255)
    avatar_url: Optional[str] = Field(default=None, max_length=255)
    email: EmailStr = Field(unique=True, index=True, max_length=255)
    phone: Optional[str] = Field(default=None, max_length=255)
    is_active: bool = Field(default=True)
    is_verified: bool = Field(default=False)
    is_admin: bool = Field(default=False)
    social_login: bool = Field(default=False)
    social_login_provider: Optional[str] = Field(default=None, max_length=50)
    social_login_id: Optional[str] = Field(default=None, max_length=255)
    timezone: Optional[str] = Field(default=None, max_length=255)
    language: Optional[str] = Field(default=None, max_length=255)
    currency: Optional[str] = Field(default=None, max_length=255)
    plan_id: Optional[uuid.UUID] = Field(foreign_key="plan.id", default=None, nullable=True)
    plan_start_date: Optional[datetime] = Field(default=None)
    plan_end_date: Optional[datetime] = Field(default=None)
    requires_password_change: bool = Field(default=False)
    created_at: datetime = Field(default_factory=datetime.utcnow, nullable=False)
    updated_at: datetime = Field(default_factory=datetime.utcnow, nullable=False)


# Properties to receive via API on user creation
class UserCreate(UserBase):
    first_name: Optional[str] = Field(default=None, max_length=255)
    last_name: Optional[str ]= Field(default=None, max_length=255)
    is_admin: Optional[bool] = Field(default=False)
    password: str = Field(min_length=8, max_length=1500)


# User Registration for social login
class UserRegister(SQLModel):
    email: EmailStr = Field(max_length=255)
    password: str = Field(min_length=8, max_length=1500)
    first_name: Optional[str] = Field(default=None, max_length=255)
    last_name: Optional[str] = Field(default=None, max_length=255)
    avatar_url: Optional[str] = Field(default=None, max_length=255)
    phone: Optional[str] = Field(default=None, max_length=255)
    social_login: bool = Field(default=False)
    social_login_provider: Optional[str] = Field(default=None, max_length=50)
    social_login_id: Optional[str] = Field(default=None, max_length=255)
    plan_id: Optional[uuid.UUID] = Field(foreign_key="plan.id", default=None, nullable=True)
    created_at: datetime = Field(default_factory=datetime.utcnow, nullable=False)


# Properties to receive via API on user update
class UserUpdate(UserBase):
    email: Optional[EmailStr] = Field(default=None, max_length=255)
    password: Optional[str] = Field(default=None, min_length=8, max_length=500)
    updated_at: datetime = Field(default_factory=datetime.utcnow, nullable=False)


# User profile update for the current user
class UserUpdateMe(SQLModel):
    first_name: Optional[str] = Field(default=None, max_length=255)
    last_name: Optional[str] = Field(default=None, max_length=255)
    email: Optional[EmailStr] = Field(default=None, max_length=255)
    phone: Optional[str] = Field(default=None, max_length=255)
    timezone: Optional[str] = Field(default=None, max_length=255)
    language: Optional[str] = Field(default=None, max_length=255)
    currency: Optional[str] = Field(default=None, max_length=255)
    plan_id: Optional[uuid.UUID] = Field(foreign_key="plan.id", default=None, nullable=True)
    plan_start_date: Optional[datetime] = Field(default=None)
    plan_end_date: Optional[datetime] = Field(default=None)
    updated_at: datetime = Field(default_factory=datetime.utcnow, nullable=False)


# User plan update for the current user
class UserUpdatePlan(SQLModel):
    plan_id: Optional[uuid.UUID] = Field(foreign_key="plan.id", default=None, nullable=True)
    plan_start_date: Optional[datetime] = Field(default=None)
    plan_end_date: Optional[datetime] = Field(default=None)
    updated_at: datetime = Field(default_factory=datetime.utcnow, nullable=False)


# Password update for a user
class UpdatePassword(SQLModel):
    current_password: str = Field(min_length=8, max_length=500)
    new_password: str = Field(min_length=8, max_length=500)
    updated_at: datetime = Field(default_factory=datetime.utcnow, nullable=False)


# Database model for User
class User(UserBase):
    class Config:
        table = True
        from_attributes = True
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    password_hash: str
    preferences: Optional["UserPreferences"] = Relationship(
        back_populates="user",
        sa_relationship_kwargs={"uselist": False}
    )
    subscriptions: List["Subscription"] = Relationship(back_populates="user")
    notifications: List["Notification"] = Relationship(back_populates="user")
    audit_logs: List["AuditLog"] = Relationship(back_populates="user")
    sessions: List["UserSession"] = Relationship(back_populates="user")


# Public properties for User
class UserPublic(UserBase):
    id: uuid.UUID
    preferences: Optional["UserPreferencesPublic"] = Field(
        default=None, alias="preferences"
    )

    class Config:
        from_attributes = True


# Public properties for Users
class UsersPublic(SQLModel):
    data: List[UserPublic]
    count: int


# ------------------------------- Plan Models -------------------------------

# Shared properties for Plan
class PlanBase(SQLModel):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    name: str = Field(index=True, max_length=255)
    description: Optional[str] = Field(default=None, max_length=500)
    price: float = Field(default=0.0)
    duration_in_days: int = Field(default=365)
    is_active: bool = Field(default=True)
    created_at: datetime = Field(default_factory=datetime.utcnow, nullable=False)
    updated_at: datetime = Field(default_factory=datetime.utcnow, nullable=False)


# Database model for Plan
class Plan(PlanBase):
    class Config:
        table = True
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)


# ------------------------------- Payments Models -----------------------------------
# Database model for Payment
class PaymentsBase(SQLModel):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    user_id: uuid.UUID = Field(foreign_key="user.id", nullable=False)
    plan_id: uuid.UUID = Field(foreign_key="plan.id", nullable=False)
    payment_method: str = Field(max_length=255)
    payment_reference: str = Field(max_length=255, unique=True, nullable=False)
    amount: float = Field(default=0.0, nullable=False)
    currency: str = Field(max_length=255, nullable=False)
    payment_date: datetime = Field(default_factory=datetime.utcnow, nullable=False)
    status: str = Field(max_length=255)
    created_at: datetime = Field(default_factory=datetime.utcnow, nullable=False)
    updated_at: datetime = Field(default_factory=datetime.utcnow, nullable=False)


# ------------------------------- Subscription Models -------------------------------

# Database model for Subscription
class SubscriptionBase(SQLModel):
    user_id: uuid.UUID = Field(foreign_key="user.id", nullable=False)
    name: str | None = Field(default=None, min_length=1, max_length=100)
    description: Optional[str] | None = Field(default=None, max_length=255)
    amount: float | None = Field(default=None, ge=0)
    currency: str | None = Field(default=None, max_length=255)
    billing_cycle: str | None = Field(default=None, max_length=255)
    category: str | None = Field(default=None, max_length=255)
    next_billing_date: datetime
    logo: str | None = Field(default=None, max_length=255)
    active: bool = Field(default=True)
    auto_renew: bool = Field(default=True)
    created_at: datetime = Field(default_factory=datetime.utcnow, nullable=False)
    updated_at: datetime = Field(default_factory=datetime.utcnow, nullable=False)

class SubscriptionCreate(SubscriptionBase):
    user_id: uuid.UUID

class SubscriptionUpdate(SQLModel):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    name: str | None = Field(default=None, min_length=1, max_length=100)
    description: Optional[str] | None = Field(default=None, max_length=255)
    amount: float | None = Field(default=None, ge=0)
    next_billing_date: datetime | None = None
    updated_at: datetime = Field(default_factory=datetime.utcnow, nullable=False)

class Subscription(SubscriptionBase):
    class Config:
        table = True
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    user_id: uuid.UUID = Field(foreign_key="user.id", nullable=False, ondelete="CASCADE")
    user: Optional["User"] = Relationship(back_populates="subscriptions")

class SubscriptionPublic(SubscriptionBase):
    id: uuid.UUID
    user_id: uuid.UUID

class SubscriptionsPublic(SQLModel):
    data: List[SubscriptionPublic]
    count: int


# ------------------------------- User Preferences Models -------------------------------

class UserPreferences(SQLModel):
    __tablename__ = "user_preferences"
    class Config:
        table = True
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    user_id: uuid.UUID = Field(foreign_key="user.id", nullable=False, ondelete="CASCADE")
    user: User = Relationship(back_populates="preferences")
    email_notifications: bool = Field(default=False)
    push_notifications: bool = Field(default=False)
    sms_notifications: bool = Field(default=False)
    theme: str = Field(default="system")
    language: str = Field(default="en")
    time_format: str = Field(default="24h")
    default_view: str = Field(default="list")
    reminder_days: int = Field(default=5)
    currency: str = Field(default="USD")
    show_inactive_subscriptions: bool = Field(default=True)
    billing_updates: bool = Field(default=True)
    new_features: bool = Field(default=True)
    tips: bool = Field(default=False)
    newsletter: bool = Field(default=True)
    created_at: datetime = Field(default_factory=datetime.utcnow, nullable=False)
    updated_at: datetime = Field(default_factory=datetime.utcnow, nullable=False)


class UserPreferencesPublic(SQLModel):
    id: uuid.UUID
    user_id: uuid.UUID
    email_notifications: Optional[bool] = Field(default=False)
    push_notifications: Optional[bool] = Field(default=False)
    sms_notifications: Optional[bool] = Field(default=False)
    theme: Optional[str] = Field(default=None, max_length=255)
    language: Optional[str] = Field(default=None, max_length=255)
    time_format: Optional[str] = Field(default=None, max_length=255)
    default_view: Optional[str] = Field(default=None, max_length=255)
    reminder_days: Optional[int] = Field(default=None)
    currency: Optional[str] = Field(default=None, max_length=255)
    show_inactive_subscriptions: Optional[bool] = Field(default=False)
    billing_updates: Optional[bool] = Field(default=False)
    new_features: Optional[bool] = Field(default=False)
    tips: Optional[bool] = Field(default=False)
    newsletter: Optional[bool] = Field(default=False)

    class Config:
        from_attributes = True


class UserPreferencesUpdate(SQLModel):
    user_id: Optional[uuid.UUID] = None
    email_notifications: Optional[bool] = None
    push_notifications: Optional[bool] = None
    sms_notifications: Optional[bool] = None
    theme: Optional[str] = None
    language: Optional[str] = None
    time_format: Optional[str] = None
    default_view: Optional[str] = None
    reminder_days: Optional[int] = None
    currency: Optional[str] = None
    show_inactive_subscriptions: Optional[bool] = None
    billing_updates: Optional[bool] = None
    new_features: Optional[bool] = None
    tips: Optional[bool] = None
    newsletter: Optional[bool] = None

# ------------------------------- Notification Models -------------------------------

class Notification(SQLModel):
    class Config:
        table = True
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    user_id: uuid.UUID = Field(foreign_key="user.id", nullable=False, ondelete="CASCADE")
    user: User = Relationship(back_populates="notifications")
    type: str = Field(max_length=255)
    title: str = Field(max_length=255)
    message: str = Field(max_length=255)
    read: bool = Field(default=False)
    action_url: Optional[str] | None = Field(default=None, max_length=255)
    action_text: Optional[str] | None = Field(default=None, max_length=255)
    created_at: datetime = Field(default_factory=datetime.utcnow, nullable=False)
    updated_at: datetime = Field(default_factory=datetime.utcnow, nullable=False)


# ------------------------------- Discount Models -------------------------------

class Discount(SQLModel):
    class Config:
        table = True
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    plan_id: uuid.UUID = Field(foreign_key="plan.id", nullable=False, ondelete="CASCADE")
    name: str = Field(max_length=255)
    code: str = Field(max_length=50, unique=True)
    type: str = Field(max_length=50)  # Discount type: fixed or percentage
    description: Optional[str] = Field(default=None, max_length=255)
    discount: float = Field(default=0)
    expired_at: datetime
    created_at: datetime = Field(default_factory=datetime.utcnow, nullable=False)
    updated_at: datetime = Field(default_factory=datetime.utcnow, nullable=False)


# ------------------------------- Audit Log Models -------------------------------

class AuditLog(SQLModel):
    class Config:
        table = True
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    user_id: uuid.UUID = Field(foreign_key="user.id", nullable=False, ondelete="CASCADE")
    user: User = Relationship(back_populates="audit_logs")
    action: str = Field(max_length=255)
    timestamp: datetime = Field(default_factory=datetime.utcnow)


# ------------------------------- Token Models -------------------------------

class Token(SQLModel):
    access_token: str
    token_type: str = "bearer"
    expiry: int


class TokenPayload(SQLModel):
    sub: Optional[str] = None


# ------------------------------- Password Reset Models -------------------------------

class NewPassword(SQLModel):
    token: str
    new_password: str = Field(min_length=8, max_length=500)


# Generic message
class Message(SQLModel):
    message: str


# ------------------------------- User Session Models -------------------------------

class UserSession(SQLModel):
    __tablename__ = "user_sessions"
    class Config:
        table = True
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    user_id: uuid.UUID = Field(foreign_key="user.id")
    device_name: str
    device_type: str
    device_ip: Optional[str] = None
    location: Optional[str] = None
    is_current: bool = Field(default=False)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    last_active: datetime = Field(default_factory=datetime.utcnow)

    user: User = Relationship(back_populates="sessions")

class UserSessionsReadResponse(SQLModel):
    sessions: List[UserSession]

class UserSessionCreate(SQLModel):
    device_name: str
    device_type: str
    device_ip: Optional[str] = None
    location: Optional[str] = None

class UserSessionUpdateData(SQLModel):
    device_name: Optional[str] = None
    device_type: Optional[str] = None
    device_ip: Optional[str] = None
    location: Optional[str] = None

class UserSessionUpdate(SQLModel):
    session_id: uuid.UUID
    requestBody: UserSessionUpdateData

class UserSessionsCreateData(SQLModel):
    requestBody: UserSessionCreate

class UserSessionsCreateResponse(SQLModel):
    id: uuid.UUID
    user_id: uuid.UUID
    device_name: str
    device_type: str
    device_ip: Optional[str] = None
    location: Optional[str]
    is_current: bool
    created_at: datetime
    last_active: datetime

class UserSessionsUpdateCurrentResponse(SQLModel):
    message: str
