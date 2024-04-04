import os
from moviepy.editor import AudioFileClip

def get_audio_duration(file_path):
    audio_clip = AudioFileClip(file_path)
    duration = audio_clip.duration
    audio_clip.close()
    return duration

# Get the current script directory
current_directory = os.path.dirname(os.path.abspath(__file__))

# Loop through all files in the current directory
for filename in os.listdir(current_directory):
    if filename.endswith(".mp3"):  # Consider only MP3 files, you can change the extension if needed
        file_path = os.path.join(current_directory, filename)
        duration_seconds = get_audio_duration(file_path)
        print("Duration of", filename, ":", duration_seconds, "seconds")
