"""Add image_url to fermentation_logs

Revision ID: f27716d2914e
Revises: 4fbe94f9e549
Create Date: 2026-07-30 19:00:37.354382

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision: str = 'f27716d2914e'
down_revision: Union[str, Sequence[str], None] = '4fbe94f9e549'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.add_column('fermentation_logs', sa.Column('image_url', sa.String(), nullable=True))


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_column('fermentation_logs', 'image_url')
