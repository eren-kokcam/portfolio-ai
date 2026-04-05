from pydantic_settings import BaseSettings
from dotenv import load_dotenv

load_dotenv()

class Settings(BaseSettings):
    anthropic_api_key: str
    alpha_vantage_api_key: str

    class Config:
        env_file = ".env"

settings = Settings()