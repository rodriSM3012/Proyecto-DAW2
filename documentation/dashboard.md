### **Esquema de Funcionalidades del Dashboard**

**[LEYENDA DE ROLES]**
*   **Color Naranja:** Administrador
*   **Color Azul:** Operador
*   **Color Verde:** Auditor

**--- RAÍZ ---**

*   **Dashboard** (Nodo Principal)

---

**--- SECCIÓN CENTRAL: MENÚ LATERAL ---**

*   **menú lateral**
    *   resumen de stock global (**Rol:** Administrador)
    *   alertas activas (**Rol:** Administrador)
    *   gráficos de rotación ABC (**Rol:** Administrador)
    *   últimos movimientos (**Rol:** Administrador)
    *   acceso rápido al escáner (**Rol:** Operador)
    *   tareas pendientes (**Rol:** Operador)
    *   notificaciones de alertas (**Rol:** Operador)
    *   resumen de movimientos (**Rol:** Auditor)
    *   reportes de integridad (**Rol:** Auditor)
    *   indicadores de errores (**Rol:** Auditor)

---

**--- MÓDULOS DE GESTIÓN ---**

*   **1. Gestión de stock / movimientos**
    *   registrar entrada o salida de mercancía (**Rol:** Administrador)
    *   ajuste de inventario
    *   historial de movimientos

*   **2. Gestión de catálogo**
    *   listado de productos
    *   detalles del producto
    *   crear/editar/eliminar producto (**Rol:** Administrador)

*   **3. Módulo de alertas**
    *   lista de alertas activas
    *   historial de alertas
    *   configuración de alertas (**Rol:** Administrador)

*   **4. Escaneo de QR**
    *   escáner con cámara (**Rol:** Operador)
    *   escaneo a partir de una imagen guardada (**Rol:** Operador)

*   **5. Clasificación ABC**
    *   configuración del método ABC (**Rol:** Administrador)
    *   ejecutar reclasificación (**Rol:** Administrador)
    *   visualización de clasificación actual

*   **6. Reportes y estadísticas** *(Nota: Esta es la sección a la derecha, marcada con el número 6 en la imagen original)*
    *   reporte de stock anual
    *   reporte de movimientos
    *   reporte de errores/discrepancias
    *   exportación de errores

---

**--- MÓDULOS ADMINISTRATIVOS ---**

*   **6. Administración de usuarios** *(Nota: Esta es la sección a la izquierda, también marcada con el número 6 en la imagen original)*
    *   listado de usuarios (**Rol:** Administrador)
    *   crear/editar usuario (**Rol:** Administrador)
    *   gestión de roles (**Rol:** Administrador)

*   **8. Configuración general**
    *   configuración de la aplicación (**Rol:** Administrador)
    *   configuración de notificaciones (**Rol:** Administrador)
    *   seguridad (contraseñas y logs) (**Rol:** Administrador)

---

**--- PERFIL DE USUARIO ---**

*   **9. Perfil de usuario**
    *   ver datos del perfil
    *   cambiar contraseña
    *   preferencias