FROM ubuntu:16.04
FROM node:boron

RUN apt-get -y update && \
    apt-get install -y apt-transport-https nano wget dialog net-tools && \
    apt-get install -y nginx

WORKDIR /etc/nginx
RUN rm nginx.conf
COPY nginx.conf .

COPY delivery /etc/nginx/sites-available

WORKDIR /etc/nginx/sites-enabled
RUN ln -s ../sites-available/delivery delivery

WORKDIR /home/tp/operator

COPY package.json .
COPY package-lock.json .

RUN npm install

COPY . .

WORKDIR /home/tp/operator

RUN npm run webpack
RUN mkdir front

WORKDIR /home/tp/front
RUN mkdir assets

WORKDIR /home/tp/front/assets
RUN mkdir js

WORKDIR /home/tp/operator
RUN mv dist/index.html /home/tp/front
RUN mv dist/assets/js/app.bundle.js /home/tp/front/assets/js
RUN mv dist/assets/js/vendor.bundle.js /home/tp/front/assets/js

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
