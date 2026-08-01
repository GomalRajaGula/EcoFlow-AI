"""Add ideal characteristics to product_templates

Revision ID: c1d2e3f4a5b6
Revises: b1c2d3e4f5a6
Create Date: 2026-08-01 13:25:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = 'c1d2e3f4a5b6'
down_revision: Union[str, Sequence[str], None] = 'b1c2d3e4f5a6'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column('product_templates', sa.Column('ideal_ph_min', sa.Float(), nullable=True, server_default='3.0'))
    op.add_column('product_templates', sa.Column('ideal_ph_max', sa.Float(), nullable=True, server_default='5.0'))
    op.add_column('product_templates', sa.Column('ideal_aroma', sa.String(), nullable=True, server_default='sour'))
    op.add_column('product_templates', sa.Column('ideal_color', sa.String(), nullable=True, server_default='brown'))


def downgrade() -> None:
    op.drop_column('product_templates', 'ideal_color')
    op.drop_column('product_templates', 'ideal_aroma')
    op.drop_column('product_templates', 'ideal_ph_max')
    op.drop_column('product_templates', 'ideal_ph_min')
