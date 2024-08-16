FROM node:22.3.0-alpine3.19

WORKDIR /app

COPY . .

RUN npm i -g @nestjs/cli


# ENV \
#     PORT=3000\ 
#     NODE_ENV=production \ 
#     DEMO_ENV=DEMO_ENV \ 
#     MONGO_URI=mongodb://host.docker.internal:27017/sodtb


RUN npm install 
# --only=production

COPY . .

EXPOSE ${PORT}

CMD ["nest", "start"]
