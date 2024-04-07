sudo pacman -Syu --noconfirm
sudo pacman -S git git-lfs base-devel yt-dlp ffmpeg --noconfirm

sudo useradd -m builduser
sudo passwd -d builduser
echo 'builduser ALL=(ALL) NOPASSWD: ALL' | sudo tee /etc/sudoers.d/builduser
su builduser
cd ~



git clone https://github.com/jimchen2/AnonyTube-updated-
mv AnonyTube-updated-/Worker/ .
sudo rm -r AnonyTube-updated-/



cat <<'EOF' > /home/builduser/Worker/run_worker.py
import subprocess
import time
import os
import glob

while True:
    subprocess.run(["/home/builduser/myenv/bin/python", "/home/builduser/Worker/worker.py"])
    
    # Cleanup: Remove temporary folders in the current directory
    temp_folders = glob.glob('/home/builduser/Worker/tmp*')
    for folder in temp_folders:
        os.system(f'rm -rf {folder}')
    
    time.sleep(60)
EOF




cd ~
git clone https://aur.archlinux.org/yay.git
cd yay
makepkg -si --noconfirm
rm -rf yay




cd ~
python3 -m venv myenv
source myenv/bin/activate
pip install boto3 botocore pymongo transformers torch uuid whisper-ctranslate2 chardet



cd ~
git clone https://huggingface.co/facebook/nllb-200-distilled-600M
git lfs install
cd nllb-200-distilled-600M && git lfs pull

cd ~
git clone https://github.com/jimchen2/private_repo
mv private_repo/config.py Worker/config.py





sudo su



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
sudo systemctl daemon-reload

sudo systemctl enable --now worker



