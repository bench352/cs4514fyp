import os

# Postgres config for the server
POSTGRES_HOST = os.environ.get("POSTGRES_HOST", "localhost")
POSTGRES_PORT = os.environ.get("POSTGRES_PORT", 5432)
POSTGRES_USER = os.environ.get("POSTGRES_USER", "postgres")
POSTGRES_PASSWORD = os.environ.get("POSTGRES_PASSWORD", "password")
POSTGRES_DB = os.environ.get("POSTGRES_DB", "postgres")

# API key used to access the server
GLOBAL_API_KEY = os.environ.get("GLOBAL_API_KEY", "<KEY>")

# Server config
PORT = int(os.environ.get("PORT", 8000))
RELOAD = bool(os.environ.get("RELOAD", "false").lower() == "true")

# JWT config
JWT_SECRET = os.environ.get("JWT_SECRET", "secret")
JWT_EXPIRE_IN_MINUTES = int(os.environ.get("JWT_EXPIRE_IN_MINUTES", 5))

# Master admin config (used to create the first admin user)
MASTER_ADMIN_USERNAME = os.environ.get("MASTER_ADMIN_USERNAME", "admin")
MASTER_ADMIN_PASSWORD = os.environ.get("MASTER_ADMIN_PASSWORD", "password")
