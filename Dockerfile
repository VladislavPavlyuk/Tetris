# Stage 1: build frontend
FROM node:20-alpine AS client
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci
COPY index.html vite.config.ts tsconfig.json tsconfig.app.json tsconfig.node.json ./
COPY src ./src
ENV VITE_API_URL=
RUN npm run build

# Stage 2: backend + serve client
FROM node:20-alpine
WORKDIR /app
COPY server/package.json server/package-lock.json* ./
RUN npm install
COPY server/ ./
RUN npm run build
COPY --from=client /app/dist ./client-dist
EXPOSE 3001
CMD ["node", "dist/index.js"]
