# 🧪 Test Red Social - Prueba Técnica

Este proyecto corresponde a una **prueba técnica** realizada por **Carlos Andrés Medina**. Consiste en el backend de una red social básica desarrollada con **NestJS**, utilizando una arquitectura basada en capas con controladores, servicios, repositorios e interfaces. Incluye gestión de usuarios, publicaciones (posts) y likes.

---

## 🚀 Tecnologías

- **NestJS** (v10+)
- **TypeORM** con PostgreSQL
- **Swagger** para documentación
- **Docker & Docker Compose**
- **Jest** para pruebas unitarias
- **bcrypt** para hasheo de contraseñas

---

## 📁 Estructura del Proyecto

```
src/
│
├── modules/
│   ├── users/
│   ├── posts/
│   └── likes/
│
├── database/
│   ├── migrations/
│   └── typeorm.config.ts
│
├── shared/
│
└── main.ts
```

- **modules**: Contiene cada módulo con su controlador, servicio, repositorio, DTOs y entidad.
- **database/migrations**: Migraciones para la base de datos PostgreSQL.
- **shared**: Interfaces e inyección de dependencias.

---

## 🐳 Cómo correr con Docker

```bash
docker compose up --build
```

Esto levantará:

- API NestJS en `http://localhost:3000`
- pgAdmin en `http://localhost:5050` (usuario y contraseña en `.env`)
- Base de datos PostgreSQL

⚠️ Las migraciones se ejecutan automáticamente al levantar el contenedor.

---

## 🧪 Ejecutar pruebas

```bash
npm run test
```

> Se ejecutan pruebas unitarias con Jest para módulos de users, posts y likes.

---

## 🔐 Autenticación

Para acceder a los endpoints protegidos se debe usar un JWT válido. En esta prueba no se implementó el login completo, pero se incluyó el guard `JwtAuthGuard` para proteger rutas.

---

## 📄 Documentación Swagger

Disponible en:

```
http://localhost:3000/api
```

---

## 📦 Variables de entorno

Se usan archivos `.env` para definir la configuración del entorno. Ya están incluidos en el repositorio para facilitar las pruebas.

---

## 🙋 Autor

Carlos Andrés Medina

✅ Proyecto listo para revisión técnica.