sudo pacman -Syu
sudo pacman -S git base-devel npm nodejs yt-dlp ffmpeg wget nginx certbot certbot-nginx
sudo useradd -m builduser
sudo passwd -d builduser
echo 'builduser ALL=(ALL) NOPASSWD: ALL' | sudo tee /etc/sudoers.d/builduser
su builduser
cd ~
git clone https://aur.archlinux.org/yay.git
cd yay
makepkg -si --noconfirm
yay -S mongodb-tools mongodb-bin  mongosh-bin --noconfirm


su builduser
cd ~
python -m venv myenv
source myenv/bin/activate
pip install boto3 botocore pymongo transformers torch uuid
yay -S whisper

su builduser
cd ~
git clone https://huggingface.co/facebook/nllb-200-distilled-600M/


