import os
import subprocess
from pymongo import MongoClient
import boto3
from botocore.client import Config
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM, pipeline
import torch
from config import mongoURI, publicurl, s3_bucket, s3_access_key, s3_secret_key, s3_endpoint

from pymongo import UpdateOne

# MongoDB configuration
client = MongoClient(mongoURI)
db = client.videoPlatform

# Translation model configuration
local_model_dir = "/home/user/Downloads/nllb-200-distilled-600M"
model = AutoModelForSeq2SeqLM.from_pretrained(local_model_dir)
tokenizer = AutoTokenizer.from_pretrained(local_model_dir)
device = -1  # Force use CPU

def download_video(video_url):
    """Download the video using yt-dlp and return the filename."""
    cmd = f"yt-dlp -f bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best --merge-output-format mp4 '{video_url}' -o '%(title)s.%(ext)s'"
    subprocess.run(cmd, shell=True, check=True)
    get_filename_cmd = f"yt-dlp --get-filename -o '%(title)s.%(ext)s' '{video_url}'"
    process = subprocess.run(get_filename_cmd, shell=True, check=True, stdout=subprocess.PIPE, universal_newlines=True)
    file_name = process.stdout.strip()
    return file_name

def convert_to_mp4(file_name):
    """Convert the video to MP4 format using ffmpeg."""
    if not file_name.lower().endswith('.mp4'):
        mp4_file_name = file_name.rsplit('.', 1)[0] + '.mp4'
        ffmpeg_cmd = f"ffmpeg -i '{file_name}' -codec copy '{mp4_file_name}'"
        subprocess.run(ffmpeg_cmd, shell=True, check=True)
        rm_cmd = f"rm '{file_name}'"
        subprocess.run(rm_cmd, shell=True, check=True)
        return mp4_file_name
    return file_name

def get_video_resolution(file_name):
    """Get the video resolution using ffprobe."""
    ffprobe_cmd = f"ffprobe -v error -select_streams v:0 -show_entries stream=width,height -of csv=s=x:p=0 '{file_name}'"
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

def prepare_video_files(file_name, qualities):
    """Prepare video files with different qualities using ffmpeg."""
    video_files = []
    for quality in qualities:
        output_file = f"{file_name}_{quality}.mp4"
        if quality == "1080p":
            ffmpeg_cmd = f"ffmpeg -i '{file_name}' -vf scale=1920:1080 -c:v libx264 -preset medium -crf 20 -c:a copy '{output_file}'"
        elif quality == "720p":
            ffmpeg_cmd = f"ffmpeg -i '{file_name}' -vf scale=1280:720 -c:v libx264 -preset medium -crf 23 -c:a copy '{output_file}'"
        else:  # 360p
            ffmpeg_cmd = f"ffmpeg -i '{file_name}' -vf scale=640:360 -c:v libx264 -preset medium -crf 25 -c:a copy '{output_file}'"
        subprocess.run(ffmpeg_cmd, shell=True, check=True)
        video_files.append({"filename": output_file, "quality": quality})
    return video_files

def extract_audio(file_name):
    """Extract the audio from the video using ffmpeg."""
    audio_file_name = file_name.rsplit('.', 1)[0] + '.wav'
    ffmpeg_cmd = f"ffmpeg -i '{file_name}' -vn -acodec pcm_s16le -ar 48000 -ac 2 '{audio_file_name}'"
    subprocess.run(ffmpeg_cmd, shell=True, check=True)
    return audio_file_name
    
def transcribe_audio(audio_file_name, video_language):
    """Transcribe the audio using whisper."""
    transcription_cmd = f"whisper --model medium --language {video_language} --output_format vtt '{audio_file_name}' --fp16 False"
    print(transcription_cmd)
    subprocess.run(transcription_cmd, shell=True, check=True)
    vtt_file_name = audio_file_name.replace('.m4a', '.vtt')
    language_vtt_filename = video_language + '_' + vtt_file_name
    os.rename(vtt_file_name, language_vtt_filename)
    return language_vtt_filename

def translate(text, src_lang, tgt_lang):
    """Translate the text using the translation pipeline."""
    translation_pipeline = pipeline("translation", model=model, tokenizer=tokenizer, src_lang=src_lang, tgt_lang=tgt_lang, max_length=400, device=device)
    result = translation_pipeline(text)
    return result[0]['translation_text']

def translate_every_nth_line(file_path, src_lang, tgt_lang, output_file_path, n=3):
    """Translate every nth line of the subtitle file."""
    with open(file_path, 'r', encoding='utf-8') as file:
        lines = file.readlines()

    with open(output_file_path, 'w', encoding='utf-8') as file:
        for i, line in enumerate(lines, start=4):  # Start counting from 1
            if (i - 1) % n == 0:
                translated_line = translate(line.strip(), src_lang, tgt_lang)
                file.write(translated_line + '\n')
            else:
                file.write(line)

def language_to_code(lang):
    """Map language codes to their corresponding language codes used by the translation model."""
    lang_codes = {
        "en": "eng_Latn",  # English
        "zh": "zho_Hans",  # Chinese (Simplified)
        "ru": "rus_Cyrl",  # Russian
        "es": "spa_Latn",  # Spanish
        "fr": "fra_Latn",  # French
        "ar": "ara_Arab",  # Arabic
        "de": "deu_Latn",  # German
        "ja": "jpn_Jpan",  # Japanese
        "ko": "kor_Hang"   # Korean
    }
    return lang_codes.get(lang, None)

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

def process_videos():
    """Process the videos from the MongoDB database."""
    videos = db.videos.find({"subtitles": {"$size": 0}})

    for video in videos:
        video_url = video['videourl'][0]["url"]
        video_language = video.get('language')
        video_uploader_uuid = video.get('uploaderuuid')
        video_uuid = video.get('uuid')

        print(f"Processing video: {video_url}")

        # Download and convert the video
        file_name = download_video(video_url)
        file_name = convert_to_mp4(file_name)

        # Get video resolution and determine qualities
        height = get_video_resolution(file_name)
        qualities = determine_video_qualities(height)

        # Prepare video files with different qualities
        video_files = prepare_video_files(file_name, qualities)

        # Upload video files to S3
        video_urls = {}
        for video_file in video_files:
            s3_key = f"videos/{video_uploader_uuid}/{video_uuid}.{video_file['quality']}.mp4"
            video_url = upload_to_s3(video_file['filename'], s3_key)
            print(video_url)
            print("\n\n\n\n\n\n")
            video_urls[video_file['quality']] = video_url

        # Extract audio and transcribe
        audio_file_name = extract_audio(file_name)
        language_vtt_filename = transcribe_audio(audio_file_name, video_language)

        # Define the list of target languages
        target_languages = ["en", "zh"]

        # Translate subtitles
        subtitle_urls = {}

        # Upload the original language subtitle
        s3_key = f"subtitles/{video_uploader_uuid}/{video_uuid}.{video_language}.vtt"
        subtitle_url = upload_to_s3(language_vtt_filename, s3_key)
        subtitle_urls[video_language] = subtitle_url

        # Translate and upload subtitles for target languages
        for target_lang in target_languages:
            if video_language != target_lang:
                input_file_path = language_vtt_filename
                output_file_path = f"{target_lang}_{input_file_path}"
                src_lang = language_to_code(video_language)
                tgt_lang = language_to_code(target_lang)
                translate_every_nth_line(input_file_path, src_lang, tgt_lang, output_file_path, n=3)
                s3_key = f"subtitles/{video_uploader_uuid}/{video_uuid}.{target_lang}.vtt"
                subtitle_url = upload_to_s3(output_file_path, s3_key)
                subtitle_urls[target_lang] = subtitle_url
                print(subtitle_url+"\n\n\n\n\n\n\n\n\n\n")
        
        updateVideoData(video_uuid, video_urls, subtitle_urls)

        # Remove temporary files
        for video_file in video_files:
            os.remove(video_file['filename'])
        os.remove(audio_file_name)
        os.remove(language_vtt_filename)
        for lang in subtitle_urls:
            if lang != video_language:
                os.remove(f"{lang}_{language_vtt_filename}")

            

if __name__ == "__main__":
    process_videos()