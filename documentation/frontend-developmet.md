### 🔧 Paso 0 – Configuración inicial

Antes de escribir una línea de UI, crea la estructura base de React que usará la guía de estilo **Soft Industrial** (Entrega 6) y se comunicará con tu backend.

- Inicia proyecto con Vite + React.
- Instala dependencias clave: `react-router-dom`, `axios`, `lucide-react`, librería de QR (ej. `html5-qrcode` o `qr-scanner`), `recharts` para gráficos ABC y `tailwindcss` o CSS modules (según prefieras).
- Define la paleta de colores como variables CSS:
  ```css
  --color-midnight: #1A192A;
  --color-concrete: #8B9097;
  --color-safety-gold: #F2A900;
  --color-hyperlink-blue: #1D6A92;
  --color-logistics-green: #00BF7D;
  --color-scorched-red: #C92306;
  ```
- Crea una estructura de carpetas alineada con el mapa de navegación:
  ```
  src/
    components/     (botones, tarjetas, layout, etc.)
    hooks/          (useAuth, useScanner, useAlerts, etc.)
    pages/          (Dashboard, Catalogo, Movimientos, ...)
    services/       (api.js con Axios, interceptores de token)
    context/        (AuthContext, RoleContext)
    styles/         (tema, variables)
  ```
- Configura `api.js` para que adjunte el token JWT y maneje errores 401/403.

---

### 📅 Fases de desarrollo del frontend

Cada fase puede ser una iteración Kanban. Comienzas con lo fundamental y añades complejidad.

#### Fase 1: Autenticación, Layout y Menú Lateral (Seguridad y navegación base)
**Objetivo:** El usuario puede iniciar sesión, ver el menú acorde a su rol y navegar entre páginas vacías.

- **Login / Logout**: formulario, llamada a `/auth/login`, almacenar token en cookie/state, redirigir a dashboard.
- **Registro de usuarios (solo admin)**: proteger la ruta y el botón.
- **AuthContext + RoleContext**: Almacena datos del usuario y nivel de rol (usa la jerarquía `admin>operador>auditor`).
- **Layout base** (barra superior + menú lateral): el menú muestra solo las opciones permitidas según el nivel del rol (usa el esquema que ya tienes).
- **Páginas placeholder** para cada módulo.

#### Fase 2: Dashboard y componentes compartidos
**Objetivo:** El administrador/auditor ve un resumen en tiempo real.

- **Componentes de KPI**: tarjetas con total productos, stock bajo, alertas activas, etc.
- **Endpoint `GET /api/dashboard`** (debes crearlo en backend) o usar llamadas separadas a productos, alertas, movimientos.
- **Gráfico de distribución ABC** (pastel o barras con Recharts).
- **Lista de últimos movimientos** y **alertas activas** en el dashboard.
- **Componentes reutilizables** que necesitarás luego: `ProductCard`, `StockBadge`, `AlertBadge`.

#### Fase 3: Gestión de catálogo (CRUD de productos)
**Objetivo:** El administrador puede crear, editar, eliminar (soft) productos y ver el QR generado.

- **Lista de productos** con filtros rápidos.
- **Formulario de producto** (crear/editar) con validaciones en frontend (campos obligatorios, precios negativos, etc.) y feedback visual.
- **Vista de detalle** que muestre el código QR como UUID y, cuando el backend lo implemente, la imagen generada.
- **Eliminar** con confirmación, reflejando el borrado lógico.

#### Fase 4: Escaneo de QR y registro de movimientos
**Objetivo:** El operador escanea un código y registra una entrada/salida.

- **Integración de la cámara** con `html5-qrcode` o similar. Componente `Scanner` reutilizable.
- **Flujo completo**:
  1. Escanear QR → obtener ID del producto.
  2. Mostrar datos del producto (nombre, stock actual) llamando a `GET /productos/:id`.
  3. Operador elige tipo (entrada/salida) y cantidad.
  4. Enviar `POST /api/movimientos` con todos los datos.
  5. Feedback visual (toast verde/rojo) y actualización del stock en pantalla.
- **Alternativa**: subir imagen de QR desde galería.
- **Restricción de ajustes**: solo admin puede hacer ajustes. Oculta esa opción si el rol no es admin.

#### Fase 5: Módulo de movimientos (historial y filtros)
**Objetivo:** Auditor y admin consultan el historial.

- **Tabla de movimientos** con columnas: producto, tipo, cantidad, fecha, usuario.
- **Filtros** por fecha, tipo de movimiento, producto (si el backend los soporta).
- **Paginación** (si hay muchos registros).
- Integración con el dashboard.

#### Fase 6: Alertas (visualización y gestión)
**Objetivo:** Admin ve alertas activas, las marca como leídas.

- **Lista de alertas** con orden: primero no leídas, luego por fecha.
- **Marcar como leída** (`PATCH /alertas/:id/read`) con un botón.
- **Badge en el menú lateral** indicando el número de alertas no leídas.
- **Vista de configuración** (umbrales por producto) – se puede hacer desde el formulario de producto o una página aparte.

#### Fase 7: Clasificación ABC
**Objetivo:** Administrador visualiza y fuerza reclasificación.

- **Vista de clasificación actual**: tabla con productos ordenados por impacto, coloreados por categoría A/B/C.
- **Botón “Ejecutar reclasificación”** que llama a `POST /api/products/reclassify-abc` (solo admin).
- **Filtrar por categoría**.
- **Forzar categoría manualmente** desde la ficha del producto (ya lo tienes en el formulario de edición).

#### Fase 8: Reportes, Administración de usuarios y Configuración
- **Reportes**: exportación simple (CSV) de movimientos y errores, gráficos anuales (puede ser mock inicial).
- **Administración de usuarios**: solo admin. Lista de usuarios, crear (con selección de rol), editar, desactivar.
- **Configuración general**: cambio de contraseña, preferencias de notificaciones (esto último puede ser demo).
- **Perfil de usuario**: todos los roles pueden ver sus datos y cambiar contraseña.

#### Fase 9: Pulido final, responsive y accesibilidad
- **Guía de estilo Soft Industrial**: asegurar que todos los componentes usan la paleta de colores, tipografía Inter, iconos Lucide.
- **Responsive**: probar en móvil (el escáner debe ser usable con una mano) y tablet.
- **WCAG AA**: contraste suficiente, etiquetas ARIA.
- **Pruebas de usabilidad** con los flujos principales (escaneo, CRUD, dashboard).

---

### 🔄 Integración con el backend durante el desarrollo

En cada fase, necesitarás que ciertos endpoints estén listos. Dado que aún falta el endpoint de QR y el de dashboard, puedes:

- **Fase 1-3**: Son completamente funcionales con lo que ya tienes.
- **Fase 4**: Necesita el endpoint de QR (para obtener el ID al escanear). Mientras tanto, puedes simular el escaneo con un input manual del UUID.
- **Fase 2 (Dashboard)**: Si no tienes el endpoint agregado, en la primera versión puedes hacer varias llamadas y componer los KPIs.
- **Fases 5-8**: El backend actual cubre todo lo necesario.

---

### 🧩 Consejos finales

- **Empieza por el contexto de autenticación**: sin eso, nada funciona. Dedica el esfuerzo inicial a un `AuthProvider` robusto.
- **Reutiliza componentes**: `QRScanner`, `DataTable`, `StatusBadge`, etc.
- **Mantén el estado de roles centralizado**: así los checks de visibilidad (ej. `user.roleLevel >= 2`) son limpios.
- **Haz deploy temprano** (incluso en Vercel/Netlify) para probar en móvil real desde el día 1.
