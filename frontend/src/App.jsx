import { Navigate, Route, Routes } from "react-router-dom";
import AppLayout from "./components/AppLayout.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import CatalogPage from "./pages/CatalogPage.jsx";
import ProductDetailPage from "./pages/ProductDetailPage.jsx";
import ProductFormPage from "./pages/ProductFormPage.jsx";
// import PlaceholderPage from "./pages/PlaceholderPage.jsx";
import RegisterUserPage from "./pages/RegisterUserPage.jsx";
import ScannerPage from "./pages/ScannerPage.jsx";
import MovementsPage from "./pages/MovementsPage.jsx";
import AlertsPage from "./pages/AlertsPage.jsx";
import AbcClassificationPage from "./pages/AbcClassificationPage.jsx";
import ReportsPage from "./pages/ReportsPage.jsx";
import UsersPage from "./pages/UsersPage.jsx";
import EditUserPage from "./pages/EditUserPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import SettingsPage from "./pages/SettingsPage.jsx";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route element={<ProtectedRoute minimumRole="auditor" />}>
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/movimientos" element={<MovementsPage />} />
          <Route path="/catalogo" element={<CatalogPage />} />
          <Route path="/catalogo/:id" element={<ProductDetailPage />} />
          <Route path="/alertas" element={<AlertsPage />} />
          <Route
            path="/clasificacion-abc"
            element={<AbcClassificationPage />}
          />
          <Route path="/reportes" element={<ReportsPage />} />
          <Route path="/perfil" element={<ProfilePage />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute minimumRole="operador" />}>
        <Route element={<AppLayout />}>
          <Route path="/scanner-qr" element={<ScannerPage />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute minimumRole="admin" />}>
        <Route element={<AppLayout />}>
          <Route
            path="/catalogo/nuevo"
            element={<ProductFormPage mode="create" />}
          />
          <Route
            path="/catalogo/:id/editar"
            element={<ProductFormPage mode="edit" />}
          />
          <Route path="/usuarios" element={<UsersPage />} />
          <Route path="/usuarios/nuevo" element={<RegisterUserPage />} />
          <Route path="/usuarios/:id/editar" element={<EditUserPage />} />
          <Route path="/configuracion" element={<SettingsPage />} />
        </Route>
      </Route>

      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default App;
