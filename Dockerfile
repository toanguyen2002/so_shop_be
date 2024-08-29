FROM node:22.3.0-alpine3.19 AS install-dependencies

WORKDIR /user/src/app

COPY package.json package-lock.json ./
RUN npm install
RUN npm ci

COPY . .


FROM node:22.3.0-alpine3.19 AS build

WORKDIR /user/src/app

COPY --from=install-dependencies /user/src/app ./

RUN npm run build


FROM node:22.3.0-alpine3.19 AS run

WORKDIR /user/src/app

ENV \
    PORT=4000 \ 
    NODE_ENV=production \ 
    DEMO_ENV=DEMO_ENV \ 
    MONGO_URI=mongodb://host.docker.internal:27017/osdtb

COPY --from=build /user/src/app/dist ./dist
COPY --from=build /user/src/app/node_modules ./node_modules
COPY --from=build /user/src/app/package*.json ./

EXPOSE ${PORT}

USER node

CMD ["npm", "run", "start:prod"]
