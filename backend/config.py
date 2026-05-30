import os


class Config:
    SECRET_KEY = os.getenv("SECRET_KEY", "travel-agency-api")
    DATABASE_HOST = os.getenv("DATABASE_HOST", "localhost")
    DATABASE_PORT = int(os.getenv("DATABASE_PORT", "54321"))
    DATABASE_NAME = os.getenv("DATABASE_NAME", "travel_agency")
    DATABASE_USER = os.getenv("DATABASE_USER", "system")
    DATABASE_PASSWORD = os.getenv("DATABASE_PASSWORD", "123456789")
    CORS_ORIGINS = os.getenv("CORS_ORIGINS", "http://localhost:5173")
