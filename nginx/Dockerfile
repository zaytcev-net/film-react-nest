FROM nginx:alpine

# Удаляем стандартную конфигурацию
RUN rm /etc/nginx/conf.d/default.conf

# Добавляем нашу конфигурацию
COPY default.conf /etc/nginx/conf.d/default.conf