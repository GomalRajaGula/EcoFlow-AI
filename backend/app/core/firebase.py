import os
import firebase_admin
from firebase_admin import credentials, auth
from fastapi import HTTPException, status

FIREBASE_CREDENTIALS_PATH = os.getenv("FIREBASE_CREDENTIALS_PATH", "./firebase-credentials.json")

try:
    if not firebase_admin._apps:
        cred = credentials.Certificate(FIREBASE_CREDENTIALS_PATH)
        firebase_admin.initialize_app(cred)
except Exception as e:
    print(f"Firebase initialization warning: {e}")


def verify_token(token: str) -> dict:
    """Verifikasi Firebase ID token menggunakan Admin SDK.

    Args:
        token: Firebase ID token (JWT) dari header Authorization.

    Returns:
        dict: Claims token yang sudah ter-decode (uid, email, name, dll).

    Raises:
        HTTPException: 401 jika token invalid, expired, atau tidak terverifikasi.
    """
    try:
        decoded_token = auth.verify_id_token(token)
        return decoded_token
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")


def get_user_role(claims: dict) -> str:
    """Ambil role user dari claims token, default 'user'.

    Args:
        claims: Dictionary claims hasil verify_token.

    Returns:
        str: Role user ('user' jika tidak ada key 'role').
    """
    return claims.get("role", "user")
