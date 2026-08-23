from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    DATABASE_URL: str
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    DEBUG: bool = False
    R2_ACCOUNT_ID : str 
    R2_ENDPOINT_URL : str 
    R2_ACCESS_KEY_ID: str
    R2_SECRET_ACCESS_KEY: str
    R2_BUCKET_NAME: str
    R2_TOKEN_VALUE: str
    SUPABSE_JWT_SECRET: str
    SUPABASE_JWKS_URL: str
    MAX_STORAGE_BYTES: int


    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

settings = Settings() #type: ignore
