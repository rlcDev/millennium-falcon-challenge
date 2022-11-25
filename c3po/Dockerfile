FROM node:18.12.1 as angular
RUN mkdir -p c3p0
WORKDIR /c3p0
COPY . /c3p0
RUN npm install
RUN npm run build

FROM nginx:alpine
COPY --from=angular /c3p0/dist/c3po /usr/share/nginx/html
COPY --from=angular /c3p0/nginx/nginx.conf /etc/nginx/conf.d/default.conf

