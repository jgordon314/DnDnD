FROM node:24-alpine

ENV NEXT_TELEMETRY_DISABLED 1

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci

COPY . .

CMD ["npm", "run", "dev"]
