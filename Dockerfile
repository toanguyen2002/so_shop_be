# Stage 1: Build
FROM node:22.3.0-alpine3.19 as build

WORKDIR /user/src/app

COPY package*.json ./
RUN npm install
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Production
FROM node:22.3.0-alpine3.19

WORKDIR /user/src/app
ENV \
    PORT=4000\ 
    NODE_ENV=production \ 
    DEMO_ENV=DEMO_ENV \ 
    MONGO_URI=mongodb://host.docker.internal:27017/osdtb
# Copy only the necessary files from the build stage
COPY --from=build /user/src/app/dist ./dist
COPY --from=build /user/src/app/node_modules ./node_modules
COPY --from=build /user/src/app/package*.json ./
EXPOSE ${PORT}
USER node

CMD ["npm", "run", "start:prod"]
