FROM node:18.12.1
RUN mkdir -p millennium-chalenge
WORKDIR /millennium-chalenge
COPY . /millennium-chalenge
RUN npm install
RUN npm run build:back
CMD [ "node", "dist/src/main.js" ]
