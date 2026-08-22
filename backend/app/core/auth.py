
import jwt
from fastapi import Header, HTTPException, status
from app.core.config import settings
from jwt import PyJWKClient

_jwks_client = PyJWKClient(settings.SUPABASE_JWKS_URL)

async def get_current_user(authorization: str = Header(...)) -> str :
    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid auth header")

    token = authorization.removeprefix("Bearer ")

    try:
        signing_key = _jwks_client.get_signing_key_from_jwt(token)
        payload = jwt.decode(
            token,
            signing_key.key,
            algorithms=["ES256"],
            audience="authenticated",
        )
    except jwt.PyJWTError as e:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=f"Invalid or expired token {e}")
    user_id = payload.get("sub")
    if not user_id:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token missing user id")

    return user_id