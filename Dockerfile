FROM node:18.12.1-alpine

WORKDIR /

COPY . .

RUN npm install

EXPOSE 1995:1995

CMD ["npm", "start"]