# server/Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npx prisma generate

RUN chmod +x /app/wait-for-it.sh

ENTRYPOINT ["/bin/sh", "-c", "/app/wait-for-it.sh db 3306 20 && npx prisma migrate deploy && (npm run dev & npx prisma studio)"]




