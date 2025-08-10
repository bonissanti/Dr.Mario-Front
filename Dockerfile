#Build stage
FROM node:current-alpine AS build

WORKDIR /app

COPY package*.json .

RUN npm ci --only=production=false

COPY . .

RUN npm run build

#Production stage
FROM nginx:alpine AS production

WORKDIR /app

COPY package*.json .

COPY --from=build app/dist /usr/share/nginx/html

EXPOSE 443

CMD ["nginx", "-g", "daemon off;"]