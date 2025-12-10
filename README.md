# 🥗 NutriSmart --- README

Bienvenido/a a **NutriSmart**, un proyecto que integra:

-   Backend: Node.js
-   CMS: Strapi
-   Frontend: React (Vite)
-   Base de datos: MySQL

Este documento explica cómo instalar, configurar y ejecutar el proyecto
por primera vez.

# Requisitos previos

Asegúrate de tener instalado:

  Herramienta - Versión recomendada
  
  Node.js - 18+
  
  npm / yarn - npm 8+
  
  MySQL Server - 8.0+
  
  Git - Última versión

# Clonar el repositorio

git clone https://github.com/CesarNeri33/NutriSmart.git

cd NutriSmart

# Configuración del entorno

El proyecto está dividido en:

  /backend
  
  /cms
  
  /frontend

## Backend --- `/backend/.env`

PORT=4000

DATABASE_HOST=localhost

DATABASE_PORT=3306

DATABASE_USER=root

DATABASE_PASSWORD=tu_password

DATABASE_NAME=nutrismart_db

JWT_SECRET=tu_secreto

## Strapi CMS --- `/cms/.env`

APP_KEYS=clave1,clave2

API_TOKEN_SALT=clave_token

ADMIN_JWT_SECRET=clave_jwt_strapi

DATABASE_CLIENT=mysql

DATABASE_HOST=localhost

DATABASE_PORT=3306

DATABASE_NAME=nutrismart_cms

DATABASE_USERNAME=root

DATABASE_PASSWORD=tu_password

HOST=0.0.0.0

PORT=1337

## Frontend --- `/frontend/.env`

VITE_API_URL=http://localhost:4000

VITE_CMS_URL=http://localhost:1337

# Instalar dependencias

## Backend

cd backend

npm install

## CMS (Strapi)

cd cms

npm install

## Frontend

cd frontend

npm install

# Ejecutar el proyecto

sudo systemctl start mysql

## Iniciar Backend

cd backend

npm run dev

## Iniciar Strapi CMS

cd cms

npm run develop

Panel de administración:\

http://localhost:1337/admin

## Iniciar Frontend

cd frontend

npm start

# Estructura del proyecto

  NutriSmart
  
  ├── backend
  
  │   ├── src
  
  │   ├── package.json
  
  │   └── .env
  
  ├── cms
  
  │   ├── src
  
  │   ├── package.json
  
  │   └── .env
  
  ├── frontend
  
  │   ├── src
  
  │   │   ├── Componentes
  
  │   │   ├── Pantallas
  
  │   ├── package.json
  
  │   └── .env
  
  └── README.md

# Notas

-   Los puertos pueden modificarse según las necesidades del proyecto.

-   En el futuro puede agregarse Docker sin modificar la estructura
    actual.

-   Si el backend utiliza migraciones o seeds, deben agregarse en esta
    documentación.
