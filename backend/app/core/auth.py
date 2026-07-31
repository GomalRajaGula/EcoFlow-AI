from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.firebase import verify_token
from app.models.base import User

security = HTTPBearer()


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db),
) -> User:
    token = credentials.credentials
    decoded_token = verify_token(token)
    user_id = decoded_token.get("uid")
    token_email = decoded_token.get("email")

    if not isinstance(user_id, str) or not user_id.strip():
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication claims",
        )

    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        user = User(
            id=user_id,
            email=decoded_token.get("email", ""),
            name=decoded_token.get("name", "User"),
            role="user",
        )
        db.add(user)
        db.commit()
        db.refresh(user)

    return user


async def get_current_user_role(current_user: User = Depends(get_current_user)) -> str:
    return current_user.role


def require_role(*allowed_roles: str):
    async def role_checker(role: str = Depends(get_current_user_role)):
        if role not in allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Insufficient permissions",
            )
        return role

    return role_checker
