FROM node:jessie
LABEL  maintainer "to-hutohu <tohu.soy@gmail.com>"
RUN apt update && apt upgrade -y && apt install git curl -y  &&\
    curl -L https://github.com/docker/compose/releases/download/1.22.0/docker-compose-$(uname -s)-$(uname -m) -o /usr/local/bin/docker-compose &&\
    chmod +x /usr/local/bin/docker-compose

WORKDIR /work
ADD docker-compose.override.yml .
ADD package.json .
RUN npm install
ADD app.js .
CMD ["node", "app.js"]
