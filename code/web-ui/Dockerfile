FROM node:20-alpine3.18

COPY build /app
WORKDIR /app

RUN npm i -g serve
RUN npm i -g react-inject-env@^2.1.0

CMD npx react-inject-env set -d . && serve -s .