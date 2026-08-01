import pytest
from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app, base_url="http://localhost")


class TestSecurityHeaders:
    def test_security_headers_present(self):
        r = client.get("/")
        assert r.status_code in (200, 404)
        assert r.headers["X-Content-Type-Options"] == "nosniff"
        assert r.headers["X-Frame-Options"] == "DENY"
        assert r.headers["X-XSS-Protection"] == "1; mode=block"
        assert r.headers["Content-Security-Policy"] == "default-src 'self'"


class TestCORS:
    def test_allowed_origin_gets_cors_headers(self):
        r = client.get("/", headers={"Origin": "http://localhost:3000"})
        assert r.status_code in (200, 404)
        assert r.headers.get("access-control-allow-origin") == "http://localhost:3000"

    def test_disallowed_origin_gets_no_cors_headers(self):
        r = client.get("/", headers={"Origin": "https://evil.example.com"})
        assert r.status_code in (200, 404)
        assert "access-control-allow-origin" not in r.headers


class TestTrustedHost:
    def test_valid_host_allowed(self):
        r = client.get("/", headers={"Host": "localhost"})
        assert r.status_code in (200, 404)

    def test_invalid_host_rejected(self):
        r = client.get("/", headers={"Host": "evil.example.com"})
        assert r.status_code == 400


class TestRateLimit:
    def test_returns_429_after_limit(self):
        from app.main import rate_buckets
        rate_buckets.clear()
        for _ in range(60):
            r = client.get("/")
            assert r.status_code in (200, 404)
        r = client.get("/")
        assert r.status_code == 429
