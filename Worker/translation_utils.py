import chardet
import os
import subprocess
from transformers import pipeline
from config import mongoURI, publicurl, s3_bucket, s3_access_key, s3_secret_key, s3_endpoint, local_model_dir
from datetime import timedelta


def transcribe_audio(audio_file_path, video_language, temp_dir):
    """Transcribe the audio using whisper-ctranslate2."""
    os.chdir(temp_dir)

    # Construct the whisper-ctranslate2 command
    command = [
        "whisper-ctranslate2",
        "--model", "medium",
        "--output_format", "vtt",
        "--compute_type", "int8",
        "--language", video_language,
        audio_file_path
    ]

    # Run the whisper-ctranslate2 command using subprocess
    subprocess.run(command, check=True)

    vtt_file_name = audio_file_path.replace('.mp3', '.vtt')
    return vtt_file_name

def translate(text, src_lang, tgt_lang):
    # Define the device: use "-1" for CPU and "0" (or other appropriate number) for GPU
    device = -1
    
    # Create a translation pipeline using the local model directory
    translation_pipeline = pipeline("translation", model=local_model_dir, src_lang=src_lang, tgt_lang=tgt_lang, max_length=400, device=device)
    
    result = translation_pipeline(text)
    return result[0]['translation_text']

def translate_every_nth_line(file_path, src_lang, tgt_lang, output_file_path, n=3):
    # Detect the encoding of the file
    with open(file_path, 'rb') as file:
        result = chardet.detect(file.read())

    encoding = result['encoding']

    with open(file_path, 'r', encoding=encoding, errors='replace') as file:
        lines = file.readlines()

    with open(output_file_path, 'w') as file:
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
        "cn": "zho_Hans",  # Chinese (Simplified)
        "ru": "rus_Cyrl",  # Russian
        "es": "spa_Latn",  # Spanish
        "fr": "fra_Latn",  # French
        "ar": "ara_Arab",  # Arabic
        "de": "deu_Latn",  # German
        "ja": "jpn_Jpan",  # Japanese
        "ko": "kor_Hang"   # Korean
    }
    return lang_codes.get(lang, None)