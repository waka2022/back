FROM node:latest

WORKDIR /application

COPY package*.json ./
COPY .env ./
COPY /dist/. .

RUN npm install

CMD ["npm", "start"]