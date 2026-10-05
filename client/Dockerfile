# Build stage
FROM node:20-alpine AS build
WORKDIR /app

# No build-time VITE_BACKEND_URL required.
COPY package.json package-lock.json* ./
RUN npm ci

COPY . .
RUN npm run build

# Production stage
FROM nginx:stable-alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY entrypoint.sh /docker-entrypoint.d/30-configure-backend-url.sh
RUN chmod +x /docker-entrypoint.d/30-configure-backend-url.sh
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
