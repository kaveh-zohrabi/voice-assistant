FROM node:20-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./
COPY voice-ui/package.json voice-ui/package-lock.json ./voice-ui/
RUN npm ci && npm ci --prefix voice-ui

COPY voice-ui/ ./voice-ui/
RUN npm run build

COPY server.js ./

FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --omit=dev

COPY --from=build /app/server.js ./
COPY --from=build /app/voice-ui/dist ./voice-ui/dist

EXPOSE 3000

CMD ["node", "server.js"]
