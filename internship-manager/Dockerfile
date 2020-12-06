
# docker build -f Dockerfile -t <name> .
# docker run <port>:3000 <name>

FROM node:latest as node
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build 

FROM nginx:1.16.0-alpine
COPY --from=node /app/dist/whatAreWeCooking-app /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=node /app/dist/whatAreWeCooking-app /etc/nginx/conf.d
CMD ["nginx","-g","daemon off;"]
EXPOSE 3000