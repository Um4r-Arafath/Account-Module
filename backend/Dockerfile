FROM node:22-alpine3.19

WORKDIR /app-backend

COPY package*.json ./

RUN npm install -g nodemon

COPY . .

EXPOSE 3001

CMD [ "npm", "start" ]
