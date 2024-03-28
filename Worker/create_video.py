import os
import uuid
import subprocess
import boto3
from pymongo import MongoClient
from config import mongoURI, publicurl, s3_bucket, s3_access_key, s3_secret_key, s3_endpoint
from datetime import datetime
import argparse

def download_video(url, download_folder, filename_template):
    file_path = os.path.join(download_folder, filename_template)
    subprocess.run(["yt-dlp", "-o", file_path, url, "-N", "100"], check=True)
    return os.path.join(download_folder, os.listdir(download_folder)[-1])

def download_image(url, download_folder, filename_template):
    file_path = os.path.join(download_folder, filename_template)
    subprocess.run(["wget", "-O", file_path, url], check=True)
    return file_path

def rename_file(file_path, new_title):
    file_extension = file_path.split('.')[-1]
    new_file_path = os.path.join(os.path.dirname(file_path), f"{new_title}.{file_extension}")
    os.rename(file_path, new_file_path)
    return new_file_path

def get_video_duration(video_path):
    duration_output = subprocess.check_output(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "default=noprint_wrappers=1:nokey=1", video_path])
    return float(duration_output.decode().strip())

def upload_to_s3(file_path, s3, bucket, key):
    s3.upload_file(file_path, bucket, key)
    return f"{publicurl}/{key}"

def create_video_document(video_uuid, preview_image_url, video_url, language, title, tags, duration):
    client = MongoClient(mongoURI)
    db = client["test"]
    video_collection = db["videos"]

    video_data = {
        "uuid": video_uuid,
        "previewimageurl": preview_image_url,
        "videourl": [{"quality": "default", "url": video_url}],
        "subtitles": [],
        "language": language,
        "title": title,
        "uploaderuuid": "00000000-0000-0000-0000-000000000000",
        "likes": [],
        "likecount": 0,
        "views": [],
        "viewscount": 0,
        "tags": tags,
        "description": None,
        "duration": duration,
        "flagged": False,
        "createdAt": datetime.utcnow(),
        "updatedAt": datetime.utcnow()
    }

    video_collection.insert_one(video_data)

def create_video(videourl, title, imageurl, language, tags):
    video_path = None
    image_path = None

    try:
        download_folder = "create_video_dump"
        os.makedirs(download_folder, exist_ok=True)

        video_path = download_video(videourl, download_folder, "%(title)s.%(ext)s")
        video_title = title or os.path.splitext(os.path.basename(video_path))[0]
        video_path = rename_file(video_path, video_title)
        print(video_path)

        image_path = download_image(imageurl, download_folder, "image.jpg")
        print(image_path)

        if not os.path.exists(video_path):
            raise FileNotFoundError(f"Video file not found: {video_path}")

        duration = get_video_duration(video_path)

        video_uuid = str(uuid.uuid4())
        image_uuid = str(uuid.uuid4())

        s3 = boto3.client("s3", endpoint_url=s3_endpoint, aws_access_key_id=s3_access_key, aws_secret_access_key=s3_secret_key)

        video_key = f"admin/video/{video_uuid}.{video_path.split('.')[-1]}"
        print(video_path, video_key)
        video_url = upload_to_s3(video_path, s3, s3_bucket, video_key)
        print(video_url)

        image_key = f"admin/imageurl/{image_uuid}.{image_path.split('.')[-1]}"
        print(image_path, image_key)
        preview_image_url = upload_to_s3(image_path, s3, s3_bucket, image_key)
        print(preview_image_url)

        create_video_document(video_uuid, preview_image_url, video_url, language, video_title, tags, duration)

        print("Video created successfully.")
        print("Uploaded video URL:", video_url)
        print("Uploaded image URL:", preview_image_url)

        return {"video_url": video_url, "preview_image_url": preview_image_url}

    except Exception as e:
        print(f"Error creating video: {str(e)}")
        return None

    finally:
        if video_path is not None and os.path.exists(video_path):
            os.remove(video_path)
        if image_path is not None and os.path.exists(image_path):
            os.remove(image_path)
def main():
    parser = argparse.ArgumentParser(description='Create a video')
    parser.add_argument('--video', required=True, help='URL of the video to be downloaded')
    parser.add_argument('--title', help='Title of the video')
    parser.add_argument('--imageurl', required=True, help='URL of the preview image to be downloaded')
    parser.add_argument('--language', default='en', help='Language of the video (default: en)')
    parser.add_argument('--tags', nargs='+', default=[], help='Tags associated with the video')

    args = parser.parse_args()

    create_video(args.video, args.title, args.imageurl, args.language, args.tags)

if __name__ == '__main__':
    main()



# python create_video.py --video "https://www.1tv.ru/news/issue/2024-02-10/12:00" --imageurl "https://static.1tv.ru/uploads/video/material/splash/2024/03/24/858786/_original/858786_f487833c7c.jpg" --language "ru" --tags news 