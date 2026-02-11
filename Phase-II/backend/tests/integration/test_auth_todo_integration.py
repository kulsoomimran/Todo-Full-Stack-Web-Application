"""
Integration tests for JWT authentication with todo endpoints.
Tests verify that:
1. Authenticated requests (valid JWT) succeed
2. Unauthenticated requests (missing header) return 401
3. Todos are properly filtered by user_id from JWT
"""

import os
import pytest
from fastapi.testclient import TestClient
from sqlmodel import Session, create_engine, SQLModel
from sqlmodel.pool import StaticPool
from datetime import datetime, timedelta, timezone
import jwt

# Test-specific settings MUST be set before importing app/auth
TEST_SECRET_KEY = "test-secret-key-for-testing-only"
TEST_ALGORITHM = "HS256"
TEST_EXPIRATION_MINUTES = 30

# Set environment variables BEFORE any imports that use them
os.environ["JWT_SECRET_KEY"] = TEST_SECRET_KEY
os.environ["JWT_ALGORITHM"] = TEST_ALGORITHM
os.environ["JWT_EXPIRATION_MINUTES"] = str(TEST_EXPIRATION_MINUTES)

# Now import the app and services
# NOTE: Importing from database.py ensures all models are registered with SQLModel
from src.main import app
from src.database.database import get_session, create_tables
from src.models.todo_model import Todo, TodoResponse
from src.models.user_model import User


# Create an in-memory SQLite database for testing
@pytest.fixture(name="session")
def session_fixture():
    """Create an in-memory SQLite database for testing"""
    engine = create_engine(
        "sqlite:///:memory:",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    SQLModel.metadata.create_all(engine)
    with Session(engine) as session:
        yield session


@pytest.fixture(name="client")
def client_fixture(session: Session):
    """Create a TestClient with the in-memory database"""
    def get_session_override():
        return session

    app.dependency_overrides[get_session] = get_session_override
    client = TestClient(app)
    yield client
    app.dependency_overrides.clear()


@pytest.fixture(name="valid_token")
def valid_token_fixture():
    """Create a valid JWT token for testing"""
    user_id = "test-user-123"
    payload = {
        "sub": user_id,
        "email": "test@example.com",
        "exp": datetime.utcnow() + timedelta(minutes=TEST_EXPIRATION_MINUTES),
        "iat": datetime.utcnow()
    }
    token = jwt.encode(
        payload,
        TEST_SECRET_KEY,
        algorithm=TEST_ALGORITHM
    )
    return token


@pytest.fixture(name="expired_token")
def expired_token_fixture():
    """Create an expired JWT token for testing"""
    user_id = "test-user-123"
    payload = {
        "sub": user_id,
        "email": "test@example.com",
        "exp": datetime.utcnow() - timedelta(minutes=1),  # Expired 1 minute ago
        "iat": datetime.utcnow() - timedelta(minutes=31)
    }
    token = jwt.encode(
        payload,
        TEST_SECRET_KEY,
        algorithm=TEST_ALGORITHM
    )
    return token


@pytest.fixture(name="invalid_signature_token")
def invalid_signature_token_fixture():
    """Create a JWT token with an invalid signature"""
    user_id = "test-user-123"
    payload = {
        "sub": user_id,
        "email": "test@example.com",
        "exp": datetime.utcnow() + timedelta(minutes=TEST_EXPIRATION_MINUTES),
        "iat": datetime.utcnow()
    }
    # Sign with a different secret to create invalid signature
    token = jwt.encode(
        payload,
        "wrong-secret-key",
        algorithm="HS256"
    )
    return token


class TestJWTAuthenticationWithTodos:
    """Integration tests for JWT authentication with todo endpoints"""

    def test_get_todos_without_auth_header_returns_401(self, client: TestClient):
        """Test that GET /todos without Authorization header returns 401"""
        response = client.get("/api/v1/todos")
        assert response.status_code == 401
        assert response.json()["detail"] == "Unauthorized"

    def test_get_todos_with_valid_token_returns_200(
        self, client: TestClient, valid_token: str, session: Session
    ):
        """Test that GET /todos with valid JWT returns 200"""
        # Create a todo for the test user
        todo = Todo(
            title="Test Todo",
            description="Test description",
            completed=False,
            user_id="test-user-123"
        )
        session.add(todo)
        session.commit()

        response = client.get(
            "/api/v1/todos",
            headers={"Authorization": f"Bearer {valid_token}"}
        )
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        assert len(data) == 1
        assert data[0]["title"] == "Test Todo"

    def test_post_todo_without_auth_header_returns_401(self, client: TestClient):
        """Test that POST /todos without Authorization header returns 401"""
        response = client.post(
            "/api/v1/todos",
            json={"title": "New Todo", "description": "A new todo"}
        )
        assert response.status_code == 401
        assert response.json()["detail"] == "Unauthorized"

    def test_post_todo_with_valid_token_succeeds(
        self, client: TestClient, valid_token: str
    ):
        """Test that POST /todos with valid JWT creates a todo and assigns user_id"""
        response = client.post(
            "/api/v1/todos",
            json={"title": "New Todo", "description": "A new todo"},
            headers={"Authorization": f"Bearer {valid_token}"}
        )
        assert response.status_code == 201
        data = response.json()
        assert data["title"] == "New Todo"
        assert data["user_id"] == "test-user-123"

    def test_get_todo_by_id_without_auth_returns_401(
        self, client: TestClient, session: Session
    ):
        """Test that GET /todos/{id} without auth returns 401"""
        # Create a todo in the database
        todo = Todo(
            title="Test Todo",
            description="Test description",
            completed=False,
            user_id="test-user-123"
        )
        session.add(todo)
        session.commit()

        response = client.get(f"/api/v1/todos/{todo.id}")
        assert response.status_code == 401
        assert response.json()["detail"] == "Unauthorized"

    def test_get_todo_by_id_with_valid_token_returns_200(
        self, client: TestClient, valid_token: str, session: Session
    ):
        """Test that GET /todos/{id} with valid JWT returns the todo"""
        # Create a todo for the test user
        todo = Todo(
            title="Test Todo",
            description="Test description",
            completed=False,
            user_id="test-user-123"
        )
        session.add(todo)
        session.commit()

        response = client.get(
            f"/api/v1/todos/{todo.id}",
            headers={"Authorization": f"Bearer {valid_token}"}
        )
        assert response.status_code == 200
        data = response.json()
        assert data["id"] == todo.id
        assert data["title"] == "Test Todo"

    def test_expired_token_returns_401(
        self, client: TestClient, expired_token: str
    ):
        """Test that expired JWT returns 401"""
        response = client.get(
            "/api/v1/todos",
            headers={"Authorization": f"Bearer {expired_token}"}
        )
        assert response.status_code == 401
        assert response.json()["detail"] == "Unauthorized"

    def test_invalid_signature_token_returns_401(
        self, client: TestClient, invalid_signature_token: str
    ):
        """Test that JWT with invalid signature returns 401"""
        response = client.get(
            "/api/v1/todos",
            headers={"Authorization": f"Bearer {invalid_signature_token}"}
        )
        assert response.status_code == 401
        assert response.json()["detail"] == "Unauthorized"

    def test_malformed_token_returns_401(self, client: TestClient):
        """Test that malformed token returns 401"""
        response = client.get(
            "/api/v1/todos",
            headers={"Authorization": "Bearer not-a-valid-token"}
        )
        assert response.status_code == 401
        assert response.json()["detail"] == "Unauthorized"

    def test_missing_authorization_scheme_returns_401(self, client: TestClient):
        """Test that missing Bearer scheme returns 401"""
        response = client.get(
            "/api/v1/todos",
            headers={"Authorization": "token-without-bearer-scheme"}
        )
        assert response.status_code == 401

    def test_user_can_list_only_their_todos(self, client: TestClient, session: Session):
        """Test that a user's token can only list their own todos (User A's token → can list only User A's todos)"""
        # Create todos for User A
        user_a_todo1 = Todo(
            title="User A Todo 1",
            description="User A description 1",
            completed=False,
            user_id="user-a-123"
        )
        user_a_todo2 = Todo(
            title="User A Todo 2",
            description="User A description 2",
            completed=True,
            user_id="user-a-123"
        )
        session.add(user_a_todo1)
        session.add(user_a_todo2)

        # Create todos for User B
        user_b_todo1 = Todo(
            title="User B Todo 1",
            description="User B description 1",
            completed=False,
            user_id="user-b-456"
        )
        session.add(user_b_todo1)
        session.commit()

        # Create a token for User A
        user_a_payload = {
            "sub": "user-a-123",
            "email": "usera@example.com",
            "exp": datetime.utcnow() + timedelta(minutes=TEST_EXPIRATION_MINUTES),
            "iat": datetime.utcnow()
        }
        user_a_token = jwt.encode(
            user_a_payload,
            TEST_SECRET_KEY,
            algorithm=TEST_ALGORITHM
        )

        # Get todos for User A - should only see their own todos
        response = client.get(
            "/api/v1/todos",
            headers={"Authorization": f"Bearer {user_a_token}"}
        )
        assert response.status_code == 200
        data = response.json()
        assert len(data) == 2  # User A should see 2 todos

        # Verify that only User A's todos are returned
        todo_titles = [todo["title"] for todo in data]
        assert "User A Todo 1" in todo_titles
        assert "User A Todo 2" in todo_titles
        assert "User B Todo 1" not in todo_titles

    def test_user_cannot_access_other_users_todo_get(self, client: TestClient, session: Session):
        """Test that User A's token attempting to GET User B's todo id returns 404"""
        # Create a todo for User B
        user_b_todo = Todo(
            title="User B Todo",
            description="User B description",
            completed=False,
            user_id="user-b-456"
        )
        session.add(user_b_todo)
        session.commit()

        # Create a token for User A
        user_a_payload = {
            "sub": "user-a-123",
            "email": "usera@example.com",
            "exp": datetime.utcnow() + timedelta(minutes=TEST_EXPIRATION_MINUTES),
            "iat": datetime.utcnow()
        }
        user_a_token = jwt.encode(
            user_a_payload,
            TEST_SECRET_KEY,
            algorithm=TEST_ALGORITHM
        )

        # Try to access User B's todo with User A's token
        response = client.get(
            f"/api/v1/todos/{user_b_todo.id}",
            headers={"Authorization": f"Bearer {user_a_token}"}
        )
        assert response.status_code == 404
        assert response.json()["detail"] == "Unauthorized"  # Should return 404, not 403

    def test_user_cannot_access_other_users_todo_put(self, client: TestClient, session: Session):
        """Test that User A's token attempting to PUT User B's todo id returns 404"""
        # Create a todo for User B
        user_b_todo = Todo(
            title="User B Todo",
            description="User B description",
            completed=False,
            user_id="user-b-456"
        )
        session.add(user_b_todo)
        session.commit()

        # Create a token for User A
        user_a_payload = {
            "sub": "user-a-123",
            "email": "usera@example.com",
            "exp": datetime.utcnow() + timedelta(minutes=TEST_EXPIRATION_MINUTES),
            "iat": datetime.utcnow()
        }
        user_a_token = jwt.encode(
            user_a_payload,
            TEST_SECRET_KEY,
            algorithm=TEST_ALGORITHM
        )

        # Try to update User B's todo with User A's token
        response = client.put(
            f"/api/v1/todos/{user_b_todo.id}",
            json={"title": "Modified title"},
            headers={"Authorization": f"Bearer {user_a_token}"}
        )
        assert response.status_code == 404
        assert response.json()["detail"] == "Unauthorized"  # Should return 404, not 403
