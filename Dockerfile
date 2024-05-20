FROM node:20-alpine as build

WORKDIR /usr/src/app/

COPY package*.json ./

RUN yarn install --frozen-lockfile && yarn cache clean

COPY . .

ENV PORT=80
ENV NODE_ENV=production

CMD ["npm", "run", "serve"]
