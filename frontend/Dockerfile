# --- Stage 1: Build Stage ---
FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# توجيه الفرونت لمسارات Nginx Reverse Proxy وقت الـ Build
ARG VITE_USER_SERVICE_URL=/api/user-service
ARG VITE_CATALOG_SERVICE_URL=/api/catalog-service
ARG VITE_SEARCH_SERVICE_URL=/api/search-service
ARG VITE_PAYMENT_SERVICE_URL=/api/payment-service

ENV VITE_USER_SERVICE_URL=$VITE_USER_SERVICE_URL
ENV VITE_CATALOG_SERVICE_URL=$VITE_CATALOG_SERVICE_URL
ENV VITE_SEARCH_SERVICE_URL=$VITE_SEARCH_SERVICE_URL
ENV VITE_PAYMENT_SERVICE_URL=$VITE_PAYMENT_SERVICE_URL

RUN npm run build

# --- Stage 2: Production Stage ---
FROM nginx:alpine

RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]