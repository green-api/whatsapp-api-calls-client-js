FROM node:18-alpine

RUN git config --global credential.helper store
ARG username
ARG password
RUN echo https://${username}:${password}@github.com > ~/.git-credentials

WORKDIR /app

COPY package.json .

RUN npm install

COPY . .

RUN npm run build

EXPOSE 8080

CMD [ "npm", "run", "preview" ]