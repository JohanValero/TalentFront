# Usar node como imagen base
FROM node:18

# Directorio de trabajo en el contenedor
WORKDIR /app

# Copiar package.json y package-lock.json
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Instalar Angular CLI globalmente
RUN npm install -g @angular/cli

# Copiar el resto del código
COPY . .

# Puerto en el que corre la aplicación
EXPOSE 4200

# Comando para iniciar la aplicación
CMD ["ng", "serve", "--host", "0.0.0.0"]

# docker build -t angular-app .
# docker run -p 4200:4200 angular-app