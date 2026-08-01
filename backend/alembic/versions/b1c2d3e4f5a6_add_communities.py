from alembic import op
import sqlalchemy as sa

revision = "b1c2d3e4f5a6"
down_revision = "ea7cfb017895"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "communities",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("name", sa.String(), nullable=False, unique=True),
        sa.Column("region", sa.String(), nullable=True),
        sa.Column("created_at", sa.DateTime(), nullable=True),
        sa.Column("updated_at", sa.DateTime(), nullable=True),
    )
    op.create_index("ix_communities_id", "communities", ["id"])
    op.create_index("ix_communities_region", "communities", ["region"])
    op.add_column("users", sa.Column("community_id", sa.Integer(), nullable=True))
    op.create_index("ix_users_community_id", "users", ["community_id"])
    op.create_foreign_key("fk_users_community_id", "users", "communities", ["community_id"], ["id"])


def downgrade() -> None:
    op.drop_constraint("fk_users_community_id", "users", type_="foreignkey")
    op.drop_index("ix_users_community_id", table_name="users")
    op.drop_column("users", "community_id")
    op.drop_index("ix_communities_region", table_name="communities")
    op.drop_index("ix_communities_id", table_name="communities")
    op.drop_table("communities")
