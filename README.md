# StockTrace – Gestión inteligente de inventario para PYMEs

**Control de stock con códigos QR en tiempo real, sin hardware costoso.**  
Escanea con tu móvil, monitoriza las existencias, recibe alertas automáticas y deja que el sistema clasifique tus productos con el método ABC.

![License](https://img.shields.io/badge/license-MIT-blue)
![Node.js](https://img.shields.io/badge/backend-Node.js-green)
![React](https://img.shields.io/badge/frontend-React-61DAFB)
![MySQL](https://img.shields.io/badge/database-MySQL-orange)

---

## ✨ Funcionalidades

- **Catálogo de productos** con generación automática de código QR (UUID único por producto)
- **Movimientos en tiempo real** – entradas, salidas y ajustes con actualización instantánea del stock
- **Alertas inteligentes** – avisos cuando el stock cae por debajo del mínimo configurado
- **Clasificación ABC** – análisis de Pareto automático para un control estratégico del inventario
- **Acceso por roles** – tres perfiles de usuario: Administrador, Operador, Auditor
- **Diseño responsive** – funciona en ordenadores, tablets y smartphones
- **Reportes exportables** – descarga de movimientos y alertas en formato CSV
- **Dashboard** – KPIs, gráfico ABC y actividad en vivo según el rol

---

## 🧰 Stack Tecnológico

| Capa | Tecnología |
|------|------------|
| Frontend | React 18, Vite, React Router, Axios, Recharts, html5-qrcode, Lucide React |
| Backend | Node.js, Express, mysql2, bcrypt, jsonwebtoken |
| Base de datos | MySQL (MariaDB 10.4+) |
| Estilos | CSS vanilla con Custom Properties (guía de estilo "Soft Industrial") |

---

## 📸 Capturas de pantalla
### 1. Inicio de sesión
![[other/screenshots/web1.png]]
### 2. Dashboard del administrador
![[other/screenshots/web2.png]]
### 3. Vista de catálogo
![[other/screenshots/web3.png]]
### 4. Clasificación ABC de cada producto
![[other/screenshots/web4.png]]
### 5. Página de detalles del producto
![[other/screenshots/web5.png]]

---

## 🚀 Puesta en marcha

Sigue estos pasos para tener una copia local de StockTrace funcionando.

### Requisitos previos

- **Node.js** ≥ 18
- **npm** ≥ 9
- **MySQL** (o MariaDB) con un servidor local en funcionamiento
- **Git** (opcional)

### Instalación

1. **Clona el repositorio**
   ```bash
   git clone https://github.com/tu-usuario/stocktrace.git
   cd stocktrace
   ```
2. 
3. **Configura la base de datos**
   - Crea una nueva base de datos MySQL (por ejemplo, `stocktrace_db`)
   - Importa el volcado SQL que se incluye (si dispones de él) o ejecuta el esquema manualmente.
   - Ejemplo:
     ```sql
     CREATE DATABASE stocktrace_db CHARACTER SET utf8 COLLATE utf8_spanish_ci;
     ```
     Luego carga el archivo de esquema que se encuentra en `/database` (si existe) o utiliza el script de creación de tablas.

3. **Backend**
   ```bash
   cd backend
   npm install
   ```

4. **Frontend**
   ```bash
   cd ../frontend
   npm install
   ```

### Variables de entorno

Dentro de la carpeta `backend`, crea un archivo `.env` (puedes copiar de `.env.example` si se proporciona):

```
PORT=4000
NODE_ENV=development
JWT_SECRET=tu-clave-secreta-cambiala
JWT_EXPIRES_IN=8h
COOKIE_SECURE=false
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=tucontraseña
DB_NAME=stocktrace_db
```

### Ejecutar la aplicación

1. **Inicia el servidor backend**
   ```bash
   cd backend
   npm start
   ```
   (El servidor escuchará en el puerto 4000 por defecto.)

2. **Inicia el servidor de desarrollo del frontend**
   ```bash
   cd frontend
   npm run dev
   ```
   La aplicación se abrirá en `http://localhost:5173`.

3. **Crea un usuario administrador**  
   El primer administrador debe insertarse directamente en la base de datos porque el registro está restringido.  
   Utiliza el script SQL proporcionado o ejecuta:
   ```sql
   INSERT INTO usuario (nombre, email, password_hash, rol, created_at)
   VALUES ('Admin', 'admin@ejemplo.com', '<hash-bcrypt>', 'admin', NOW());
   ```
   (Genera un hash bcrypt de tu contraseña usando `bcrypt.hashSync` o una herramienta en línea.)

---

## 📁 Estructura del proyecto

```
stocktrace/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── database/
│   │   ├── middleware/
│   │   ├── routes/
│   │   ├── services/
│   │   └── utils/
│   ├── .env
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── services/
│   │   └── App.jsx
│   ├── .env
│   └── package.json
├── database/
│   └── schema.sql          (opcional)
├── docs/
│   └── memoria.pdf
└── README.md
```

---

## 🔌 Endpoints de la API

| Método | Ruta                           | Acceso         | Descripción                   |
| ------ | ------------------------------ | -------------- | ----------------------------- |
| POST   | `/auth/login`                  | público        | Iniciar sesión y obtener JWT  |
| POST   | `/auth/register`               | admin          | Registrar un nuevo usuario    |
| GET    | `/api/products`                | autenticado    | Listar productos              |
| POST   | `/api/products`                | admin          | Crear producto                |
| PUT    | `/api/products/:id`            | admin          | Actualizar producto           |
| DELETE | `/api/products/:id`            | admin          | Eliminar (lógico) producto    |
| GET    | `/api/products/:id/qr`         | autenticado    | Redirigir a la imagen QR      |
| GET    | `/api/movimientos`             | autenticado    | Listar movimientos            |
| POST   | `/api/movimientos`             | admin/operador | Registrar movimiento          |
| GET    | `/api/alertas`                 | autenticado    | Listar alertas                |
| PATCH  | `/api/alertas/:id/read`        | admin          | Marcar alerta como leída      |
| POST   | `/api/products/reclassify-abc` | admin          | Forzar reclasificación ABC    |
| GET    | `/api/dashboard`               | autenticado    | Datos agregados del dashboard |


---

## 🧪 Pruebas

El proyecto incluye cobertura de pruebas manuales para:

- CRUD de productos y generación de QR
- Registro de movimientos con validación de stock
- Control de acceso basado en roles
- Lógica de clasificación ABC
- Interfaz responsive y guía de estilo "Soft Industrial"

> Las pruebas automatizadas están previstas para futuras versiones (Jest + React Testing Library).

---

## 📦 Despliegue

Para producción, construye el frontend:

```bash
cd frontend
npm run build
```

Luego sirve la carpeta `build` desde Express o un servidor web estático. Configura las variables de entorno adecuadamente y habilita HTTPS.

---

## 📄 Documentación

La memoria completa del proyecto (en español) está disponible en la carpeta `docs/`. Incluye análisis, diseño, casos de uso, diagramas de secuencia, diagramas de clases y plan de negocio.

---

## 🤝 Contribuciones

Este es un proyecto personal con fines educativos. No se buscan contribuciones activas, pero las sugerencias y comentarios son siempre bienvenidos a través de los issues de GitHub.

---

## 📜 Licencia

Licencia MIT – siéntete libre de usar, modificar y distribuir.

---

## ✉️ Contacto

**Rodrigo Sánchez Martínez**  
rodrigo.sanchez.martinez3012@gmail.com
[https://github.com/rodriSM3012](https://github.com/rodriSM3012)