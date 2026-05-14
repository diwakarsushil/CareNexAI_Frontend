FROM node:18-alpine as base

WORKDIR /app

COPY package*.json ./

COPY . .

RUN npm install

EXPOSE 80
CMD [ "node", "startServer.js" ]
