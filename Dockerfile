# Etapa de construcción
FROM node:18 as builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build --prod

# Etapa de producción
FROM nginx:alpine

# Copiar la configuración de nginx personalizada si es necesaria
COPY nginx.conf /etc/nginx/nginx.conf

# Copiar los archivos construidos desde la etapa de builder
COPY --from=builder /app/dist/* /usr/share/nginx/html/

# Exponer puerto 80
EXPOSE 80

# nginx arranca automáticamente, no necesita CMD

# docker build -t angular-app .
# docker run -p 4200:4200 angular-app

# docker build -t talentmatch.azurecr.io/frontend/talent_match .
# docker push talentmatch.azurecr.io/frontend/talent_match
# docker run -p 4200:4200 talentmatch.azurecr.io/frontend/talent_match