FROM node:12

WORKDIR /usr/src/app

ENV PORT 3000

COPY package*.json ./

RUN npm ci --only=production

COPY ./src .

EXPOSE $PORT

CMD ["node", "./bin/www"]