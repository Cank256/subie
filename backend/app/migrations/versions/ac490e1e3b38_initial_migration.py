"""Initial migration

Revision ID: ac490e1e3b38
Revises: 
Create Date: 2025-02-12 13:02:33.831638

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
import sqlmodel.sql.sqltypes


# revision identifiers, used by Alembic.
revision: str = 'ac490e1e3b38'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('plan',
    sa.Column('id', sa.Uuid(), nullable=False),
    sa.Column('name', sqlmodel.sql.sqltypes.AutoString(length=255), nullable=False),
    sa.Column('description', sqlmodel.sql.sqltypes.AutoString(length=500), nullable=True),
    sa.Column('price', sa.Float(), nullable=False),
    sa.Column('duration_in_days', sa.Integer(), nullable=False),
    sa.Column('is_active', sa.Boolean(), nullable=False),
    sa.Column('created_at', sa.DateTime(), nullable=False),
    sa.Column('updated_at', sa.DateTime(), nullable=False),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_plan_name'), 'plan', ['name'], unique=False)
    op.create_table('discount',
    sa.Column('id', sa.Uuid(), nullable=False),
    sa.Column('plan_id', sa.Uuid(), nullable=False),
    sa.Column('name', sqlmodel.sql.sqltypes.AutoString(length=255), nullable=False),
    sa.Column('code', sqlmodel.sql.sqltypes.AutoString(length=50), nullable=False),
    sa.Column('type', sqlmodel.sql.sqltypes.AutoString(length=50), nullable=False),
    sa.Column('description', sqlmodel.sql.sqltypes.AutoString(length=255), nullable=True),
    sa.Column('discount', sa.Float(), nullable=False),
    sa.Column('expired_at', sa.DateTime(), nullable=False),
    sa.Column('created_at', sa.DateTime(), nullable=False),
    sa.Column('updated_at', sa.DateTime(), nullable=False),
    sa.ForeignKeyConstraint(['plan_id'], ['plan.id'], ondelete='CASCADE'),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('code')
    )
    op.create_table('user',
    sa.Column('id', sa.Uuid(), nullable=False),
    sa.Column('first_name', sqlmodel.sql.sqltypes.AutoString(length=255), nullable=True),
    sa.Column('last_name', sqlmodel.sql.sqltypes.AutoString(length=255), nullable=True),
    sa.Column('avatar_url', sqlmodel.sql.sqltypes.AutoString(length=255), nullable=True),
    sa.Column('email', sqlmodel.sql.sqltypes.AutoString(length=255), nullable=False),
    sa.Column('phone', sqlmodel.sql.sqltypes.AutoString(length=255), nullable=True),
    sa.Column('is_active', sa.Boolean(), default=True, nullable=False),
    sa.Column('is_verified', sa.Boolean(), default=True, nullable=False),
    sa.Column('is_admin', sa.Boolean(), default=False, nullable=False),
    sa.Column('social_login', sa.Boolean(), default=False, nullable=False),
    sa.Column('social_login_provider', sqlmodel.sql.sqltypes.AutoString(length=50), nullable=True),
    sa.Column('social_login_id', sqlmodel.sql.sqltypes.AutoString(length=255), nullable=True),
    sa.Column('timezone', sqlmodel.sql.sqltypes.AutoString(length=255), nullable=True),
    sa.Column('language', sqlmodel.sql.sqltypes.AutoString(length=255), default='en', nullable=True),
    sa.Column('currency', sqlmodel.sql.sqltypes.AutoString(length=255), default='USD', nullable=True),
    sa.Column('plan_id', sa.Uuid(), nullable=True),
    sa.Column('password_hash', sqlmodel.sql.sqltypes.AutoString(), nullable=False),
    sa.Column('reset_password_token', sqlmodel.sql.sqltypes.AutoString(length=255), nullable=True),
    sa.Column('reset_password_expires', sa.DateTime(), nullable=True),
    sa.Column('created_at', sa.DateTime(), nullable=False),
    sa.Column('updated_at', sa.DateTime(), nullable=False),
    sa.ForeignKeyConstraint(['plan_id'], ['plan.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_user_email'), 'user', ['email'], unique=True)
    op.create_table('auditlog',
    sa.Column('id', sa.Uuid(), nullable=False),
    sa.Column('user_id', sa.Uuid(), nullable=False),
    sa.Column('action', sqlmodel.sql.sqltypes.AutoString(length=255), nullable=False),
    sa.Column('timestamp', sa.DateTime(), nullable=False),
    sa.ForeignKeyConstraint(['user_id'], ['user.id'], ondelete='CASCADE'),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('notification',
    sa.Column('id', sa.Uuid(), nullable=False),
    sa.Column('user_id', sa.Uuid(), nullable=False),
    sa.Column('type', sqlmodel.sql.sqltypes.AutoString(length=255), nullable=False),
    sa.Column('title', sqlmodel.sql.sqltypes.AutoString(length=255), nullable=False),
    sa.Column('message', sqlmodel.sql.sqltypes.AutoString(length=255), nullable=False),
    sa.Column('read', sa.Boolean(), nullable=False),
    sa.Column('action_url', sqlmodel.sql.sqltypes.AutoString(length=255), nullable=True),
    sa.Column('action_text', sqlmodel.sql.sqltypes.AutoString(length=255), nullable=True),
    sa.Column('created_at', sa.DateTime(), nullable=False),
    sa.Column('updated_at', sa.DateTime(), nullable=False),
    sa.ForeignKeyConstraint(['user_id'], ['user.id'], ondelete='CASCADE'),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('subscription',
    sa.Column('id', sa.Uuid(), nullable=False),
    sa.Column('user_id', sa.Uuid(), nullable=False),
    sa.Column('name', sqlmodel.sql.sqltypes.AutoString(length=100), nullable=False),
    sa.Column('description', sqlmodel.sql.sqltypes.AutoString(length=255), nullable=True),
    sa.Column('amount', sa.Float(), nullable=False),
    sa.Column('currency', sqlmodel.sql.sqltypes.AutoString(length=255), nullable=False),
    sa.Column('billing_cycle', sqlmodel.sql.sqltypes.AutoString(length=255), nullable=False),
    sa.Column('category', sqlmodel.sql.sqltypes.AutoString(length=255), nullable=False),
    sa.Column('next_billing_date', sa.DateTime(), nullable=False),
    sa.Column('logo', sqlmodel.sql.sqltypes.AutoString(length=255), nullable=True),
    sa.Column('active', sa.Boolean(), nullable=False),
    sa.Column('auto_renew', sa.Boolean(), nullable=False),
    sa.Column('created_at', sa.DateTime(), nullable=False),
    sa.Column('updated_at', sa.DateTime(), nullable=False),
    sa.ForeignKeyConstraint(['user_id'], ['user.id'], ondelete='CASCADE'),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('user_preferences',
    sa.Column('id', sa.Uuid(), nullable=False),
    sa.Column('user_id', sa.Uuid(), nullable=False),
    sa.Column('email_notifications', sa.Boolean(), nullable=False),
    sa.Column('push_notifications', sa.Boolean(), nullable=False),
    sa.Column('sms_notifications', sa.Boolean(), nullable=False),
    sa.Column('theme', sqlmodel.sql.sqltypes.AutoString(), default='system', nullable=False),
    sa.Column('language', sqlmodel.sql.sqltypes.AutoString(), default='en', nullable=False),
    sa.Column('currency', sqlmodel.sql.sqltypes.AutoString(), default='USD', nullable=False),
    sa.Column('time_format', sqlmodel.sql.sqltypes.AutoString(), default='24h', nullable=False),
    sa.Column('default_view', sqlmodel.sql.sqltypes.AutoString(), default='list', nullable=False),
    sa.Column('reminder_days', sa.Integer(), default=5, nullable=False),
    sa.Column('show_inactive_subscriptions', sa.Boolean(), default=True, nullable=False),
    sa.Column('billing_updates', sa.Boolean(), default=True, nullable=False),
    sa.Column('new_features', sa.Boolean(), default=True, nullable=False),
    sa.Column('tips', sa.Boolean(), default=False, nullable=False),
    sa.Column('newsletter', sa.Boolean(), default=True, nullable=False),
    sa.Column('created_at', sa.DateTime(), nullable=False),
    sa.Column('updated_at', sa.DateTime(), nullable=False),
    sa.ForeignKeyConstraint(['user_id'], ['user.id'], ondelete='CASCADE'),
    sa.PrimaryKeyConstraint('id')
    )
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('user_preferences')
    op.drop_table('subscription')
    op.drop_table('notification')
    op.drop_table('auditlog')
    op.drop_index(op.f('ix_user_email'), table_name='user')
    op.drop_table('user')
    op.drop_table('discount')
    op.drop_index(op.f('ix_plan_name'), table_name='plan')
    op.drop_table('plan')
    # ### end Alembic commands ###
