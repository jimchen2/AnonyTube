# add /root/config.js  
###########################################################################################
sudo pacman -Syu --noconfirm; sudo pacman -S git base-devel npm nodejs nginx certbot --noconfirm
sudo useradd -m builduser && sudo passwd -d builduser && echo 'builduser ALL=(ALL) NOPASSWD: ALL' | sudo tee /etc/sudoers.d/builduser
sudo -u builduser bash -c 'cd ~; git clone https://aur.archlinux.org/yay-bin.git; cd yay-bin; makepkg -si --noconfirm; cd ..; rm -rf yay-bin; yay -S mongodb-tools mongosh-bin mongodb-bin --noconfirm'
sudo systemctl enable --now mongodb
###########################################################################################
# Only this part below in the (same) system
sudo mkdir -p /var/www; sudo git clone https://github.com/jimchen2/AnonyTube /var/www/AnonyTube; sudo chown -R builduser:builduser /var/www/AnonyTube
sudo -u builduser bash -c 'cd /var/www/AnonyTube; mongorestore --dir=./dump;'

sudo -u builduser bash -c 'cd /var/www/AnonyTube/VideoPlatform; npm install'
sudo cp /var/www/AnonyTube/VideoPlatform.service /etc/systemd/system/VideoPlatform.service && sudo mv /root/config.js /var/www/AnonyTube/VideoPlatform/src/config.js
sudo systemctl daemon-reload && sudo systemctl enable --now VideoPlatform

sudo -u builduser bash -c 'cd /var/www/AnonyTube/frontend; npm install; npm run build'

certbot certonly --standalone -d anonytube.jimchen.me --email jimchen4214@gmail.com --non-interactive --agree-tos && systemctl enable --now certbot-renew.timer 

mkdir -p /etc/nginx/{sites-available,sites-enabled} && sudo ln -sf /etc/nginx/sites-available/AnonyTube.conf /etc/nginx/sites-enabled/
sudo cp /var/www/AnonyTube/AnonyTube.conf /etc/nginx/sites-available/AnonyTube.conf
sudo cp /var/www/AnonyTube/nginx.conf /etc/nginx/nginx.conf
sudo systemctl enable --now nginx
