FROM node:18-alpine as builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Copy source code first (needed for npm install prepare script)
COPY . .

# Install dependencies (this will also run prepare -> build)
RUN npm install --legacy-peer-deps

# Production stage - serve with nginx
FROM nginx:alpine

# Copy built files
COPY --from=builder /app/build /usr/share/nginx/html/build
COPY --from=builder /app/demo /usr/share/nginx/html/demo
COPY --from=builder /app/node_modules /usr/share/nginx/html/node_modules

# Copy nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
