import os

# Postgres config for the server
POSTGRES_HOST = os.environ.get('POSTGRES_HOST', 'localhost')
POSTGRES_PORT = os.environ.get('POSTGRES_PORT', 5432)
POSTGRES_USER = os.environ.get('POSTGRES_USER', 'postgres')
POSTGRES_PASSWORD = os.environ.get('POSTGRES_PASSWORD', 'password')
POSTGRES_DB = os.environ.get('POSTGRES_DB', 'postgres')

# API key used to access the server
GLOBAL_API_KEY = os.environ.get('GLOBAL_API_KEY', '<KEY>')
