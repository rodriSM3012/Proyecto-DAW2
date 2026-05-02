import { Navigate, Route, Routes } from "react-router-dom";
import AppLayout from "./components/AppLayout.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import PlaceholderPage from "./pages/PlaceholderPage.jsx";
import RegisterUserPage from "./pages/RegisterUserPage.jsx";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route element={<ProtectedRoute minimumRole="auditor" />}>
        <Route element={<AppLayout />}>
          <Route
            path="/dashboard"
            element={<DashboardPage />}
          />
          <Route
            path="/movimientos"
            element={
              <PlaceholderPage
                title="Gestión de stock / movimientos"
                description="Registrar entradas, salidas y ajustes de inventario con historial."
              />
            }
          />
          <Route
            path="/catalogo"
            element={
              <PlaceholderPage
                title="Gestión de catálogo"
                description="Listado de productos, detalle y acciones CRUD según permisos."
              />
            }
          />
          <Route
            path="/alertas"
            element={
              <PlaceholderPage
                title="Módulo de alertas"
                description="Alertas activas, histórico y configuración de umbrales."
              />
            }
          />
          <Route
            path="/clasificacion-abc"
            element={
              <PlaceholderPage
                title="Clasificación ABC"
                description="Visualización de categorías y ejecución de reclasificación."
              />
            }
          />
          <Route
            path="/reportes"
            element={
              <PlaceholderPage
                title="Reportes y estadísticas"
                description="Reportes de stock, movimientos, discrepancias y exportables."
              />
            }
          />
          <Route
            path="/perfil"
            element={
              <PlaceholderPage
                title="Perfil de usuario"
                description="Consulta de datos personales y cambio de contraseña."
              />
            }
          />
        </Route>
      </Route>

      <Route element={<ProtectedRoute minimumRole="operador" />}>
        <Route element={<AppLayout />}>
          <Route
            path="/scanner-qr"
            element={
              <PlaceholderPage
                title="Escaneo de QR"
                description="Escáner por cámara o imagen para registrar movimientos rápidamente."
              />
            }
          />
        </Route>
      </Route>

      <Route element={<ProtectedRoute minimumRole="admin" />}>
        <Route element={<AppLayout />}>
          <Route path="/usuarios" element={<RegisterUserPage />} />
          <Route
            path="/configuracion"
            element={
              <PlaceholderPage
                title="Configuración general"
                description="Preferencias de aplicación, notificaciones y seguridad."
              />
            }
          />
        </Route>
      </Route>

      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default App;
