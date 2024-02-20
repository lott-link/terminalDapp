FROM node:14 as builder

WORKDIR /app

COPY package*.json ./

RUN npm i

COPY . ./

RUN npm run build

FROM nginx:1.25.0

WORKDIR /usr/share/nginx/html

RUN rm -rf ./*

COPY --from=builder /app/build ./

COPY ./nginx.conf /etc/nginx/conf.d/default.conf

ENTRYPOINT ["nginx", "-g", "daemon off;"]
