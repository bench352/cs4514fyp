FROM python:3.11.6-slim

COPY . /app
WORKDIR /app

RUN pip install poetry==1.7.1

RUN poetry config virtualenvs.create false
RUN poetry install --no-dev

CMD cd src && poetry run python3 main.py
