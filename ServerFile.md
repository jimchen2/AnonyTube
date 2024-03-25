
[builduser@localhost VideoPlatform]$ pwd
/home/builduser/AnonyTube-updated-/VideoPlatform
[builduser@localhost VideoPlatform]$ npm start

> videoplatform@1.0.0 start
> node src/server.js

mongodb://localhost:27017/videoPlatform
Server running on port 1242


#This is the backend, on port 1242



[builduser@localhost frontend]$ pwd
/home/builduser/AnonyTube-updated-/frontend
[builduser@localhost frontend]$ ls
build  node_modules  package.json  package-lock.json  public  src
[builduser@localhost frontend]$ 
#build is the frontend, shall be on port 80
#nginx shall have permission, nginx is http
#website:anonytube.jimchen.me
#use let's encrypt
#proxy the backend to /api
