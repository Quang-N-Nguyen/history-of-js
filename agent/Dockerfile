FROM node:22-bookworm

RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 \
    build-essential \
    iproute2 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /agent

COPY package.json package-lock.json* ./
RUN npm ci

COPY tsconfig.json ./
COPY server.ts ./
RUN npm run build
RUN npm prune --omit=dev

ENV NODE_ENV=production
ENV PORT=8080
EXPOSE 8080

CMD ["node", "dist/server.js"]
