# # FROM node:18.20.4

# # WORKDIR /app

# # # Copiar solo package.json y package-lock.json
# # COPY package*.json ./

# # # Instalar dependencias dentro del contenedor (Linux)
# # RUN npm ci

# # # Copiar todo el proyecto
# # COPY . .

# # # Exponer puerto de Vite
# # EXPOSE 5173

# # # Comando para levantar el servidor de desarrollo
# # CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "5173"]


# FROM node:18.20.4

# WORKDIR /app

# # Copiar solo package.json y package-lock.json
# COPY package*.json ./

# # Instalar dependencias
# RUN npm ci

# # Exponer puerto de Vite
# EXPOSE 5173

# # Hot reload en Docker (importantísimo: polling para Windows)
# CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "5173"]


FROM node:18.20.4

WORKDIR /app

# Copiar solo archivos de dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm ci

# Copiar el resto del código
COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "5173"]
