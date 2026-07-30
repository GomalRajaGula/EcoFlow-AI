import os
import boto3
from botocore.client import Config
from botocore.exceptions import ClientError
from fastapi import UploadFile, HTTPException
import uuid

# Configuration for MinIO
MINIO_ENDPOINT = os.getenv("MINIO_ENDPOINT", "http://localhost:9000")
MINIO_ACCESS_KEY = os.getenv("MINIO_ACCESS_KEY", "minioadmin")
MINIO_SECRET_KEY = os.getenv("MINIO_SECRET_KEY", "minioadmin")
MINIO_BUCKET_NAME = os.getenv("MINIO_BUCKET_NAME", "ecoflow-bucket")

# Initialize S3 client for MinIO
s3_client = boto3.client(
    's3',
    endpoint_url=MINIO_ENDPOINT,
    aws_access_key_id=MINIO_ACCESS_KEY,
    aws_secret_access_key=MINIO_SECRET_KEY,
    config=Config(signature_version='s3v4'),
    region_name='us-east-1' # dummy region
)

def ensure_bucket_exists():
    try:
        s3_client.head_bucket(Bucket=MINIO_BUCKET_NAME)
    except ClientError as e:
        error_code = e.response.get('Error', {}).get('Code')
        if error_code == '404':
            s3_client.create_bucket(Bucket=MINIO_BUCKET_NAME)
            # Make the bucket publicly readable for easy image serving (optional, depends on security needs)
            bucket_policy = {
                'Version': '2012-10-17',
                'Statement': [{
                    'Sid': 'AddPerm',
                    'Effect': 'Allow',
                    'Principal': '*',
                    'Action': ['s3:GetObject'],
                    'Resource': f'arn:aws:s3:::{MINIO_BUCKET_NAME}/*'
                }]
            }
            import json
            try:
                s3_client.put_bucket_policy(Bucket=MINIO_BUCKET_NAME, Policy=json.dumps(bucket_policy))
            except Exception as policy_e:
                print(f"Warning: Could not set public bucket policy: {policy_e}")
        else:
            raise

async def upload_file_to_storage(file: UploadFile, folder: str = "general") -> str:
    """Uploads a file to MinIO and returns the URL."""
    ensure_bucket_exists()
    
    file_extension = os.path.splitext(file.filename)[1]
    unique_filename = f"{folder}/{uuid.uuid4()}{file_extension}"
    
    try:
        # Reset file pointer before reading
        await file.seek(0)
        file_content = await file.read()
        
        s3_client.put_object(
            Bucket=MINIO_BUCKET_NAME,
            Key=unique_filename,
            Body=file_content,
            ContentType=file.content_type
        )
        
        # Return the public URL for the file
        # Note: In production with HTTPS and proper domain, this URL construction might differ
        return f"{MINIO_ENDPOINT}/{MINIO_BUCKET_NAME}/{unique_filename}"
        
    except ClientError as e:
        raise HTTPException(status_code=500, detail=f"Storage error: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Upload failed: {str(e)}")
