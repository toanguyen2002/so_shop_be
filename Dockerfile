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
    # MONGO_URI=mongodb://host.docker.internal:27017/osdtb \
    MONGO_URI=mongodb+srv://toanguyen240124:DMLQKyF1sqj3Paul@cluster0.nkonvfp.mongodb.net/?retryWrites=true&w=majority\
    AWS_ACCESS_KEY_ID=AKIAU2HPBJXX7HS52FSO\
    AWS_SECRET_ACCESS_KEY=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\
    AWS_REGION=us-east-1\
    AWS_BUCKET_NAME=doantotnghiepiuh\
    AWS_URL_RETURN_IMAGE=https://doantotnghiepiuh.s3.amazonaws.com\
    MAIL_USERNAME=toanguyen120921@gmail.com\
    MAIL_PASSWORD="pkyw ypxj uqrf qmno"\
    URLPAYMENT=https://getandbuy.shop\
    URL_BACK="https://facebook.com"

COPY --from=build /user/src/app/dist ./dist
COPY --from=build /user/src/app/node_modules ./node_modules
COPY --from=build /user/src/app/package*.json ./

EXPOSE ${PORT}

USER node

CMD ["npm", "run", "start:prod"] 
