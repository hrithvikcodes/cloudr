import boto3
from botocore.client import Config

from app.core.config import settings

r2_client = boto3.client(
    "s3",
    endpoint_url = settings.R2_ENDPOINT_URL,
    aws_access_key_id = settings.R2_ACCESS_KEY_ID,
    aws_secret_access_key = settings.R2_SECRET_ACCESS_KEY,
    config=Config(signature_version="s3v4"),
    

)
R2_BUCKET_NAME = settings.R2_BUCKET_NAME

