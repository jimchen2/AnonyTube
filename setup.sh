# add /config.js  

sudo pacman -Syu --noconfirm; sudo pacman -S git base-devel npm nodejs nginx certbot --noconfirm
sudo useradd -m builduser && sudo passwd -d builduser && echo 'builduser ALL=(ALL) NOPASSWD: ALL' | sudo tee /etc/sudoers.d/builduser
sudo -u builduser bash -c 'cd ~; git clone https://aur.archlinux.org/yay-bin.git; cd yay-bin; makepkg -si --noconfirm; cd ..; rm -rf yay-bin; yay -S mongodb-tools mongosh-bin mongodb-bin --noconfirm'
sudo mkdir -p /var/www; sudo git clone https://github.com/jimchen2/AnonyTube-updated /var/www/My-Website; sudo chown -R builduser:builduser /var/www/My-Website
sudo mv /config.js 
