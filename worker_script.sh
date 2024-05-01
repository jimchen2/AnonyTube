#!/bin/bash

# Create a new file config.py in / folder

######################################

# Run on 8 GB Linode

# Update system and install packages
sudo pacman -Syu --noconfirm
sudo pacman -S git git-lfs base-devel yt-dlp ffmpeg --noconfirm

# Create builduser and configure sudoers
sudo useradd -m builduser
sudo passwd -d builduser
echo 'builduser ALL=(ALL) NOPASSWD: ALL' | sudo tee /etc/sudoers.d/builduser

# Clone and setup worker environment
sudo -u builduser git clone https://github.com/jimchen2/AnonyTube /home/builduser/AnonyTube
sudo -u builduser mv /home/builduser/AnonyTube/Worker/ /home/builduser/
sudo rm -r /home/builduser/AnonyTube/

# Create run_worker.py as builduser
sudo -u builduser bash -c 'cat <<'"'"'EOF'"'"' > /home/builduser/Worker/run_worker.py
import subprocess
import time
import os
import glob

while True:
    subprocess.run(["/home/builduser/myenv/bin/python", "/home/builduser/Worker/worker.py"])

    # Cleanup: Remove temporary folders in the current directory
    temp_folders = glob.glob("/home/builduser/Worker/tmp*")
    for folder in temp_folders:
        os.system(f"rm -rf {folder}")

    time.sleep(60)
EOF'

# Install yay, an AUR helper
sudo -u builduser bash -c 'cd /home/builduser && git clone https://aur.archlinux.org/yay.git && cd yay && makepkg -si --noconfirm && rm -rf /home/builduser/yay'

# Setup Python virtual environment
sudo -u builduser bash -c 'cd /home/builduser && python3 -m venv myenv && source myenv/bin/activate && pip install boto3 botocore pymongo transformers torch uuid whisper-ctranslate2 chardet'

# Clone and setup NLLB-200 model
sudo -u builduser git clone https://huggingface.co/facebook/nllb-200-distilled-600M /home/builduser/nllb-200-distilled-600M
sudo -u builduser bash -c 'cd /home/builduser/nllb-200-distilled-600M && git lfs install && git lfs pull'

# Clone and setup private repo
sudo mv /root/config.py /home/builduser/Worker/config.py

# Create systemd service file for worker service
cat <<EOF | sudo tee /etc/systemd/system/worker.service
[Unit]
Description=Worker Service
After=network.target

[Service]
User=builduser
WorkingDirectory=/home/builduser/Worker
ExecStart=/bin/bash -c 'source /home/builduser/myenv/bin/activate && python /home/builduser/Worker/run_worker.py'
Restart=always

[Install]
WantedBy=multi-user.target
EOF

# Enable and start the worker service
sudo systemctl daemon-reload
sudo systemctl enable --now worker
