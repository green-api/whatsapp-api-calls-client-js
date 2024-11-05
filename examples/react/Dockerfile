FROM node:18-alpine

RUN apk add git && git config --global credential.helper store
ARG username
ARG password
RUN echo https://${username}:${password}@github.com > ~/.git-credentials

WORKDIR /app

COPY package.json .

RUN npm install

COPY . .

RUN npm run build

EXPOSE 4173

CMD [ "npm", "run", "preview" ]
