"""API endpoint tests."""

import pytest
from fastapi.testclient import TestClient


class TestAuthEndpoints:
    """Authentication endpoint tests."""

    def test_login_success(self, client: TestClient, db, test_user_data):
        """Test successful login."""
        # Create user first
        from app.models.user import User
        from app.core.security import hash_password

        user = User(
            email=test_user_data["email"],
            full_name=test_user_data["full_name"],
            hashed_password=hash_password(test_user_data["password"]),
            is_active=True,
        )
        db.add(user)
        db.commit()

        # Test login
        response = client.post(
            "/api/v1/auth/login",
            json={
                "email": test_user_data["email"],
                "password": test_user_data["password"],
            },
        )
        assert response.status_code == 200
        data = response.json()
        assert "access_token" in data
        assert "refresh_token" in data
        assert data["token_type"] == "bearer"

    def test_login_invalid_credentials(self, client: TestClient):
        """Test login with invalid credentials."""
        response = client.post(
            "/api/v1/auth/login",
            json={
                "email": "nonexistent@example.com",
                "password": "WrongPassword123!",
            },
        )
        assert response.status_code == 401

    def test_health_check(self, client: TestClient):
        """Test health check endpoint."""
        response = client.get("/health")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "healthy"

    def test_root_endpoint(self, client: TestClient):
        """Test root endpoint."""
        response = client.get("/")
        assert response.status_code == 200
        data = response.json()
        assert "name" in data
        assert "version" in data