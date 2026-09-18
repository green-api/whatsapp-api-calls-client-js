FROM node:22-alpine

WORKDIR /app

COPY package.json .

RUN apk add git && npm install

COPY . .

RUN npm run build

EXPOSE 4173

CMD [ "npm", "run", "preview" ]
