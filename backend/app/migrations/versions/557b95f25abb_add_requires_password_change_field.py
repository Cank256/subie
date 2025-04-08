"""add_requires_password_change_field

Revision ID: 557b95f25abb
Revises: a6e227649d24
Create Date: 2025-04-07 14:07:16.126075

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
import sqlmodel.sql.sqltypes
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = '557b95f25abb'
down_revision: Union[str, None] = 'a6e227649d24'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column("user", sa.Column("requires_password_change", sa.Boolean(), nullable=False, server_default='false'))


def downgrade() -> None:
    op.drop_column("user", "requires_password_change")
    # ### end Alembic commands ### 