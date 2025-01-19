# Etapa de construcción
FROM node:20-alpine AS builder

# Directorio de trabajo
WORKDIR /app

# Copiar package.json y package-lock.json
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el código fuente
COPY . .

# Construir la aplicación
RUN npm run build

# Etapa de producción
FROM nginx:alpine

# Crear archivo de configuración de nginx
RUN echo 'server { \
    listen 80; \
    server_name localhost; \
    root /usr/share/nginx/html/browser; \
    index index.html; \
    location / { \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf

# Copiar los archivos construidos desde la etapa anterior
COPY --from=builder /app/dist/talent-front-ai /usr/share/nginx/html

# Exponer el puerto 80
EXPOSE 80

# Iniciar nginx
CMD ["nginx", "-g", "daemon off;"]

# docker build -t angular-app .
# docker run -p 4200:80 angular-app

# docker push talentmatch.azurecr.io/frontend/talent_match
# docker build -t talentmatch.azurecr.io/frontend/talent_match .
# docker run -p 4200:80 talentmatch.azurecr.io/frontend/talent_match