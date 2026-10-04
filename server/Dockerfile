# Use official Node.js LTS image
FROM node:20-alpine AS base

WORKDIR /usr/src/app

# Install dependencies
COPY package.json package-lock.json* ./
RUN npm ci --only=production

# Copy source
COPY . .

# Build and run
ENV NODE_ENV=production
EXPOSE 5000
CMD ["node", "server.js"]
