FROM node:20-alpine

ARG PACKAGE_JSON_PATH
ARG PORT
WORKDIR /server

COPY $PACKAGE_JSON_PATH ./

RUN npm install
RUN npm run build

EXPOSE $PORT

CMD ["npm", "run", "start"]