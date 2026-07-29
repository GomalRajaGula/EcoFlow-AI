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
    try:
        decoded_token = auth.verify_id_token(token)
        return decoded_token
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")

def get_user_role(claims: dict) -> str:
    return claims.get("role", "user")
