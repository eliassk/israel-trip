FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:22-alpine
WORKDIR /app
COPY --from=build /app/dist ./dist
COPY server ./server
ENV PORT=8787 DATA_DIR=/data
VOLUME /data
EXPOSE 8787
USER node
CMD ["node", "server/index.mjs"]
