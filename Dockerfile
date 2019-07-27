FROM heroku/heroku:18-build

USER root
WORKDIR /home/app
COPY ./package.json /home/app/package.json
RUN apt-get update
RUN apt-get -y install curl gnupg
RUN curl -sL https://deb.nodesource.com/setup_11.x  | bash -
RUN apt-get -y install nodejs git

COPY . .

ENV NODE_ENV=production
RUN git config --global http.sslverify false
RUN npm install --unsafe-perm

RUN useradd -m myuser
USER myuser

CMD ["npm", "start"]
