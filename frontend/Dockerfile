FROM node:latest

WORKDIR /home/node/app

ENV PORT=3002

COPY package*.json ./

ENV  TZ=America/Salvador

#RUN npm install -g yarn

RUN yarn install

COPY . .

EXPOSE 3002

CMD ["npm","start"]

