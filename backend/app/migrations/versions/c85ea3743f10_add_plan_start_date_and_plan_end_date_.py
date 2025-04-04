"""Add plan_start_date and plan_end_date columns to user table

Revision ID: c85ea3743f10
Revises: edeeffbe1f54
Create Date: 2025-04-04 17:32:53.374067

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
import sqlmodel.sql.sqltypes
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = 'c85ea3743f10'
down_revision: Union[str, None] = 'edeeffbe1f54'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column("user", sa.Column("plan_start_date", sa.DateTime, nullable=True))
    op.add_column("user", sa.Column("plan_end_date", sa.DateTime, nullable=True))


def downgrade() -> None:
    op.drop_column("user", "plan_end_date")
    op.drop_column("user", "plan_start_date")
    # ### end Alembic commands ###
