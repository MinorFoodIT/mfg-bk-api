#FROM node:10-alpine
FROM node:10.16-alpine

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

WORKDIR /home/node/app

COPY package*.json ./

# Arguments
ARG DB_HOST
ENV DB_HOST=${DB_HOST}


#Have to install the compiler and build dependencies in order to build bcrypt.
USER root
RUN apk --no-cache add --virtual builds-deps build-base python
RUN apk add --no-cache tzdata
ENV TZ=${TZ}
#ENV TZ America/Los_Angeles

RUN npm i -g nodemon

USER node
RUN npm install

#check file .dockerignore
COPY --chown=node:node . .

EXPOSE 4000

CMD [ "npm","run","prod" ]