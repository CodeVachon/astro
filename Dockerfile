FROM nginx:alpine
COPY ./nginx/nginx.conf /etc/nginx/nginx.conf
COPY ./nginx/blog.map /etc/nginx/blog.map
COPY ./dist /usr/share/nginx/html
EXPOSE 8080
