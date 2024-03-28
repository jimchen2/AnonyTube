import os
import subprocess
import tempfile
from pymongo import MongoClient
import boto3
from botocore.client import Config
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM, pipeline
import torch
from config import mongoURI, publicurl, s3_bucket, s3_access_key, s3_secret_key, s3_endpoint, local_model_dir, database_name
import chardet
from pymongo import UpdateOne
from video_utils import download_video, convert_to_mp4, get_video_resolution, determine_video_qualities, prepare_video_files, extract_audio, upload_to_s3, updateVideoData
from translation_utils import transcribe_audio, translate_every_nth_line, language_to_code

# MongoDB configuration
client = MongoClient(mongoURI)
db = client[database_name]  # Use the database_name variable to access the database


def process_videos():
    """Process the videos from the MongoDB database."""
    videos = db.videos.find({"subtitles": {"$size": 0}})

    for video in videos:
        video_url = video['videourl'][0]["url"]
        video_language = video.get('language')
        video_uploader_uuid = video.get('uploaderuuid')
        video_uuid = video.get('uuid')

        print("\n\n=== Processing video: {} ===".format(video_url))

        # Create a temporary directory in the current working directory
        temp_dir = tempfile.mkdtemp(dir=os.getcwd())
        print("Created temporary directory: {}".format(temp_dir))

        try:
            # Download and convert the video
            print("Downloading video...")
            file_name = download_video(video_url, temp_dir)
            print("Downloaded video: {}".format(file_name))

            print("Converting video to MP4...")
            file_name = convert_to_mp4(file_name, temp_dir)
            print("Converted video: {}".format(file_name))

            # Get video resolution and determine qualities
            print("Getting video resolution...")
            height = get_video_resolution(os.path.join(temp_dir, file_name))
            print("Video resolution: {}p".format(height))

            print("Determining video qualities...")
            qualities = determine_video_qualities(height)
            print("Video qualities: {}".format(", ".join(qualities)))

            # Prepare video files with different qualities
            print("Preparing video files with different qualities...")
            video_files = prepare_video_files(os.path.join(temp_dir, file_name), qualities, temp_dir)
            print("Prepared video files: {}".format(", ".join([f["filename"] for f in video_files])))

            # Upload video files to S3
            video_urls = {}
            for video_file in video_files:
                print("Uploading {} to S3...".format(video_file['filename']))
                s3_key = f"videos/{video_uploader_uuid}/{video_uuid}.{video_file['quality']}.mp4"
                video_url = upload_to_s3(os.path.join(temp_dir, video_file['filename']), s3_key)
                video_urls[video_file['quality']] = video_url
                print("Uploaded to S3: {}".format(video_url))

            # Extract audio and transcribe
            print("Extracting audio...")
            audio_file_name = extract_audio(os.path.join(temp_dir, file_name), temp_dir)
            print("Extracted audio: {}".format(audio_file_name))

            print("Transcribing audio...")
            language_vtt_filename = transcribe_audio(os.path.join(temp_dir, audio_file_name), video_language, temp_dir)
            print("Transcribed audio: {}".format(language_vtt_filename))

            # Define the target languages as Chinese (zh) and English (en)
            target_languages = ["en", "zh"]

            # Translate subtitles
            subtitle_urls = {}

            # Upload the original language subtitle
            print("Uploading original language subtitle to S3...")
            s3_key = f"subtitles/{video_uploader_uuid}/{video_uuid}.{video_language}.vtt"
            subtitle_url = upload_to_s3(os.path.join(temp_dir, language_vtt_filename), s3_key)
            subtitle_urls[video_language] = subtitle_url
            print("Uploaded to S3: {}".format(subtitle_url))

            # Translate and upload subtitles for target languages
            for target_lang in target_languages:
                if video_language != target_lang:
                    input_file_path = os.path.join(temp_dir, language_vtt_filename)
                    output_file_name = f"{target_lang}_{video_uuid}.vtt"
                    output_file_path = os.path.join(temp_dir, output_file_name)
                    src_lang = language_to_code(video_language)
                    tgt_lang = language_to_code(target_lang)
                    print("Translating subtitle from {} to {}...".format(src_lang, tgt_lang))
                    translate_every_nth_line(input_file_path, src_lang, tgt_lang, output_file_path, n=3)
                    print("Translated subtitle saved: {}".format(output_file_name))

                    print("Uploading translated subtitle to S3...")
                    s3_key = f"subtitles/{video_uploader_uuid}/{output_file_name}"
                    subtitle_url = upload_to_s3(output_file_path, s3_key)
                    subtitle_urls[target_lang] = subtitle_url
                    print("Uploaded to S3: {}".format(subtitle_url))

            print("Updating video data in database...")
            updateVideoData(video_uuid, video_urls, subtitle_urls)
            print("Video data updated successfully.")

        finally:
            # Clean up the temporary directory
            print("Cleaning up temporary directory: {}".format(temp_dir))
            try:
                import shutil
                shutil.rmtree(temp_dir)
            except Exception as e:
                print("Error cleaning up temporary directory: {}".format(e))
                
if __name__ == "__main__":
    process_videos()