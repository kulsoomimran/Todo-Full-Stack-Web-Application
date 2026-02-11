
import time
import pytest
from fastapi import HTTPException

from src.core import auth


def _make_token(*, secret: str, user_id: str = "user-123", email: str = "a@b.com", exp: int | None = None) -> str:
    payload: dict[str, object] = {"sub": user_id, "email": email}
    payload["exp"] = int(time.time()) + 60 if exp is None else exp

    return jwt.encode(payload, secret, algorithm=auth.settings.JWT_ALGORITHM)


def test_valid_jwt_verification(monkeypatch):
    import asyncio

    monkeypatch.setattr(auth.settings, "JWT_SECRET_KEY", "test-secret")

    token = _make_token(secret="test-secret")

    user = asyncio.run(
        auth.get_current_user(
            credentials=auth.HTTPAuthorizationCredentials(
                scheme="Bearer",
                credentials=token,
            )
        )
    )

    assert user.id == "user-123"
    assert user.email == "a@b.com"



def test_missing_authorization_header_returns_401():
    import asyncio

    with pytest.raises(HTTPException) as exc:
        asyncio.run(auth.get_current_user(credentials=None))

    assert exc.value.status_code == 401
    assert exc.value.detail == "Unauthorized"


def test_expired_token_returns_401(monkeypatch):
    import asyncio

    monkeypatch.setattr(auth.settings, "JWT_SECRET_KEY", "test-secret")

    expired_exp = int(time.time()) - 60
    token = _make_token(secret="test-secret", exp=expired_exp)

    with pytest.raises(HTTPException) as exc:
        asyncio.run(
            auth.get_current_user(
                credentials=auth.HTTPAuthorizationCredentials(
                    scheme="Bearer",
                    credentials=token,
                )
            )
        )

    assert exc.value.status_code == 401
    assert exc.value.detail == "Unauthorized"


def test_invalid_signature_returns_401(monkeypatch):
    import asyncio

    monkeypatch.setattr(auth.settings, "JWT_SECRET_KEY", "expected-secret")

    token = _make_token(secret="wrong-secret")

    with pytest.raises(HTTPException) as exc:
        asyncio.run(
            auth.get_current_user(
                credentials=auth.HTTPAuthorizationCredentials(
                    scheme="Bearer",
                    credentials=token,
                )
            )
        )

    assert exc.value.status_code == 401
    assert exc.value.detail == "Unauthorized"
