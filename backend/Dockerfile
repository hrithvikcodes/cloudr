FROM python:3.12-slim AS base

COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/

ENV UV_COMPILE_BYTECODE=1 \
    UV_LINK_MODE=copy \
    PYTHONUNBUFFERED=1

RUN useradd -m appuser
WORKDIR /app

# Set ownership before anything is built
COPY pyproject.toml uv.lock ./
RUN chown -R appuser:appuser /app
USER appuser

# Now the venv is created by appuser, not root
RUN uv sync --frozen --no-install-project --no-dev

COPY --chown=appuser:appuser . .
RUN uv sync --frozen --no-dev

ENV PATH="/app/.venv/bin:$PATH"

EXPOSE 8000

CMD ["sh", "-c", "uv run uvicorn main:app --host 0.0.0.0 --port ${PORT:-8000}"]