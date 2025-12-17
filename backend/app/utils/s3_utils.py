import boto3
from flask import current_app
import io

# Use a simple singleton pattern for client
_client = None

def _get_client():
    global _client
    if _client is not None:
        return _client

    endpoint = current_app.config.get("S3_ENDPOINT_URL")
    access_key = current_app.config.get("S3_ACCESS_KEY")
    secret_key = current_app.config.get("S3_SECRET_KEY")
    region = current_app.config.get("S3_REGION", None)

    session = boto3.session.Session()
    client = session.client(
        "s3",
        endpoint_url=endpoint,
        aws_access_key_id=access_key,
        aws_secret_access_key=secret_key,
        region_name=region
    )
    _client = client
    return _client

def upload_to_s3(file_obj, key, content_type=None):
    client = _get_client()
    bucket = current_app.config.get("S3_BUCKET")
    # Ensure stream at beginning
    try:
        file_obj.stream.seek(0)
        client.upload_fileobj(Fileobj=file_obj.stream, Bucket=bucket, Key=key, ExtraArgs={"ContentType": content_type} if content_type else {})
    except AttributeError:
        # file_obj may be a file-like object
        file_obj.seek(0)
        client.upload_fileobj(Fileobj=file_obj, Bucket=bucket, Key=key, ExtraArgs={"ContentType": content_type} if content_type else {})
    return key

def download_from_s3(key) -> bytes:
    client = _get_client()
    bucket = current_app.config.get("S3_BUCKET")
    resp = client.get_object(Bucket=bucket, Key=key)
    return resp["Body"].read()

def delete_from_s3(key):
    client = _get_client()
    bucket = current_app.config.get("S3_BUCKET")
    client.delete_object(Bucket=bucket, Key=key)
