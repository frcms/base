FROM node:12

WORKDIR /usr/src/app

ENV PORT 3000

COPY ./src/package*.json ./

RUN npm ci --only=production

COPY . .

EXPOSE $PORT

RUN cd ./src

CMD ["node", "./src/bin/www"]
