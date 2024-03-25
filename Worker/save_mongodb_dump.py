from config import mongoURI, publicurl, s3_bucket, s3_access_key, s3_secret_key, s3_endpoint
import os
import subprocess
import boto3
from botocore.config import Config

def dump_mongo_db():
    """Dump MongoDB database to a file."""
    dump_file = 'videoPlatform.gz'
    mongo_dump_cmd = f"mongodump --uri={mongoURI} --gzip --archive={dump_file} --db=videoPlatform"
    subprocess.run(mongo_dump_cmd, shell=True, check=True)
    return dump_file

def upload_to_s3(file_path, s3_key):
    """Upload a file to S3."""
    s3_client = boto3.client(
        's3',
        aws_access_key_id=s3_access_key,
        aws_secret_access_key=s3_secret_key,
        endpoint_url=s3_endpoint,
        config=Config(signature_version='s3v4')
    )
    s3_client.upload_file(file_path, s3_bucket, s3_key)
    return f"{publicurl}/{s3_key}"

def main():
    """Main function to dump MongoDB and upload to S3."""
    dump_file = dump_mongo_db()
    s3_key = f"mongodb_dumps/{dump_file}"
    upload_url = upload_to_s3(dump_file, s3_key)
    print(f"MongoDB dump uploaded to S3: {upload_url}")
    os.remove(dump_file)  # Remove the local dump file

if __name__ == "__main__":
    main()