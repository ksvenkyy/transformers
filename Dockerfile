FROM nginx:alpine

COPY dist/nginx.conf /etc/nginx/nginx.conf
COPY dist/game-station-login/browser /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
