import os
import subprocess
import boto3
from botocore.client import Config
from pymongo import UpdateOne
from pymongo import MongoClient, UpdateOne  # Import MongoClient
from config import mongoURI, publicurl, s3_bucket, s3_access_key, s3_secret_key, s3_endpoint, local_model_dir, database_name

# MongoDB connection setup
client = MongoClient(mongoURI) 
db = client[database_name]  # Use the database_name variable to access the database

def download_video(video_url, temp_dir):
    """Download the video using yt-dlp and return the filename."""
    os.chdir(temp_dir)
    cmd = f"yt-dlp -f bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best --merge-output-format mp4 '{video_url}' -o '%(title)s.%(ext)s'"
    subprocess.run(cmd, shell=True, check=True)
    get_filename_cmd = f"yt-dlp --get-filename -o '%(title)s.%(ext)s' '{video_url}'"
    process = subprocess.run(get_filename_cmd, shell=True, check=True, stdout=subprocess.PIPE, universal_newlines=True)
    file_name = process.stdout.strip()
    return file_name

def convert_to_mp4(file_name, temp_dir):
    """Convert the video to MP4 format using ffmpeg."""
    os.chdir(temp_dir)
    if not file_name.lower().endswith('.mp4'):
        mp4_file_name = file_name.rsplit('.', 1)[0] + '.mp4'
        ffmpeg_cmd = f"ffmpeg -i '{file_name}' -codec copy '{mp4_file_name}'"
        subprocess.run(ffmpeg_cmd, shell=True, check=True)
        rm_cmd = f"rm '{file_name}'"
        subprocess.run(rm_cmd, shell=True, check=True)
        return mp4_file_name
    return file_name

def get_video_resolution(file_path):
    """Get the video resolution using ffprobe."""
    ffprobe_cmd = f"ffprobe -v error -select_streams v:0 -show_entries stream=width,height -of csv=s=x:p=0 '{file_path}'"
    process = subprocess.run(ffprobe_cmd, shell=True, check=True, stdout=subprocess.PIPE, stderr=subprocess.STDOUT, universal_newlines=True)
    resolution = process.stdout.strip()
    height = int(resolution.split('x')[1])
    return height

def determine_video_qualities(height):
    """Determine the video qualities based on the video height."""
    if height >= 2160:
        return ["1080p", "720p", "360p"]
    elif height >= 1080:
        return ["720p", "360p"]
    elif height >= 720:
        return ["360p"]
    else:
        return []

def prepare_video_files(file_path, qualities, temp_dir):
    """Prepare video files with different qualities using ffmpeg."""
    os.chdir(temp_dir)
    video_files = []
    for quality in qualities:
        output_file = f"{os.path.basename(file_path)}_{quality}.mp4"
        if quality == "1080p":
            ffmpeg_cmd = f"ffmpeg -i '{os.path.basename(file_path)}' -vf scale=1920:1080 -c:v libx264 -preset medium -crf 20 -c:a copy '{output_file}'"
        elif quality == "720p":
            ffmpeg_cmd = f"ffmpeg -i '{os.path.basename(file_path)}' -vf scale=1280:720 -c:v libx264 -preset medium -crf 23 -c:a copy '{output_file}'"
        else:  # 360p
            ffmpeg_cmd = f"ffmpeg -i '{os.path.basename(file_path)}' -vf scale=640:360 -c:v libx264 -preset medium -crf 25 -c:a copy '{output_file}'"
        subprocess.run(ffmpeg_cmd, shell=True, check=True)
        video_files.append({"filename": output_file, "quality": quality})
    return video_files

def extract_audio(file_path, temp_dir):
    """Extract the audio from the video using ffmpeg and save it as an MP3 file."""
    os.chdir(temp_dir)
    audio_file_name = os.path.basename(file_path).rsplit('.', 1)[0] + '.mp3'
    ffmpeg_cmd = f"ffmpeg -i '{os.path.basename(file_path)}' -vn -acodec libmp3lame -ar 48000 -ac 2 '{audio_file_name}'"
    subprocess.run(ffmpeg_cmd, shell=True, check=True)
    return audio_file_name

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

def updateVideoData(video_uuid, new_video_urls, new_subtitle_urls):
    try:
        video_url_updates = [UpdateOne(
            {"uuid": video_uuid},
            {"$push": {
                "videourl": {
                    "quality": quality_level,
                    "url": url,
                }
            }}
        ) for quality_level, url in new_video_urls.items()]

        subtitle_updates = [UpdateOne(
            {"uuid": video_uuid},
            {"$push": {
                "subtitles": {
                    "language": language,
                    "url": url
                }
            }}
        ) for language, url in new_subtitle_urls.items()]

        db.videos.bulk_write(video_url_updates + subtitle_updates)
    except Exception as e:
        print(f"Error updating video data: {e}")