#!/bin/bash -xe
cd /home/conoha/bo

PATH=$PATH:/home/conoha/.nvm/versions/node/v9.2.0/bin

git fetch
git reset --hard origin/master
echo "export default {log: \``git log --graph --date=iso master`\`}" > static/log.js
npm install
npm run build
