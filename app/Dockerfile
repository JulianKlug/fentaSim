FROM node:17
WORKDIR app
COPY package*.json ./
RUN npm i --legacy-peer-deps
# Bundle app source
COPY . .
CMD npm run build && npm run serve
