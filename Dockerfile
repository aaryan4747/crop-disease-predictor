# Enterprise Production Dockerfile for Crop Care AI
FROM nginx:alpine

# Copy static website files to nginx html server root
COPY . /usr/share/nginx/html/

# Expose port 80
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
