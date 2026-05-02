import { useState, useEffect } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import api from "../services/api.js";
import {
  Bell,
  Boxes,
  ClipboardList,
  FileText,
  Gauge,
  QrCode,
  Settings,
  ShieldUser,
  UserCircle,
  Users,
} from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";

const MENU_ITEMS = [
  { to: "/dashboard", label: "Dashboard", icon: Gauge, minimumRole: "auditor" },
  { to: "/movimientos", label: "Gestión stock / movimientos", icon: ClipboardList, minimumRole: "auditor" },
  { to: "/catalogo", label: "Gestión de catálogo", icon: Boxes, minimumRole: "auditor" },
  { to: "/alertas", label: "Módulo de alertas", icon: Bell, minimumRole: "auditor" },
  { to: "/scanner-qr", label: "Escaneo de QR", icon: QrCode, minimumRole: "operador" },
  { to: "/clasificacion-abc", label: "Clasificación ABC", icon: ShieldUser, minimumRole: "auditor" },
  { to: "/reportes", label: "Reportes y estadísticas", icon: FileText, minimumRole: "auditor" },
  { to: "/usuarios", label: "Administración de usuarios", icon: Users, minimumRole: "admin" },
  { to: "/configuracion", label: "Configuración general", icon: Settings, minimumRole: "admin" },
  { to: "/perfil", label: "Perfil de usuario", icon: UserCircle, minimumRole: "auditor" },
];

function getRoleLabel(role) {
  if (role === "admin") return "Administrador";
  if (role === "operador") return "Operador";
  if (role === "auditor") return "Auditor";
  return "Sin rol";
}

export default function AppLayout() {
  const { user, hasRole, logout } = useAuth();
  const location = useLocation();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [unreadAlerts, setUnreadAlerts] = useState(0);

  useEffect(() => {
    if (hasRole("auditor")) {
      api.get("/api/alertas")
        .then(res => {
          const count = res.data.alerts?.filter(a => !a.leida).length || 0;
          setUnreadAlerts(count);
        })
        .catch(err => {
          // Ignore errors gracefully for layout
          console.error("Error fetching unread alerts:", err);
        });
    }
  }, [hasRole, location.pathname]);

  const visibleItems = MENU_ITEMS.filter((item) => hasRole(item.minimumRole));

  const handleLogoutClick = () => setShowLogoutConfirm(true);
  const confirmLogout = () => {
    setShowLogoutConfirm(false);
    logout();
  };
  const cancelLogout = () => setShowLogoutConfirm(false);

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <h1 className="brand-title">StockTrace</h1>
        <p className="brand-subtitle">Gestión de inventario inteligente</p>

        <nav className="side-nav">
          {visibleItems.map(({ to, label, icon: Icon }) => {
            const isActive = location.pathname === to || location.pathname.startsWith(`${to}/`);
            return (
              <Link key={to} to={to} className={`nav-item ${isActive ? "active" : ""}`}>
                <Icon size={18} />
                <span style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexGrow: 1 }}>
                  {label}
                  {to === "/alertas" && unreadAlerts > 0 && (
                    <span style={{
                      background: "var(--color-scorched-red)",
                      color: "white",
                      fontSize: "0.75rem",
                      padding: "2px 7px",
                      borderRadius: "12px",
                      fontWeight: "bold"
                    }}>
                      {unreadAlerts}
                    </span>
                  )}
                </span>
              </Link>
            );
          })}
        </nav>
      </aside>

      <div className="main-column">
        <header className="topbar">
          <div>
            <p className="topbar-greeting">Hola, {user?.name || user?.email}</p>
            <p className="topbar-role">{getRoleLabel(user?.role)}</p>
          </div>
          <button type="button" className="btn btn-ghost" onClick={handleLogoutClick}>
            Cerrar sesión
          </button>
        </header>

        <main className="page-content">
          <Outlet />
        </main>
      </div>

      {showLogoutConfirm && (
        <div className="modal-overlay">
          <div className="modal-content card">
            <h2>Cerrar sesión</h2>
            <p className="card-text">¿Estás seguro de que quieres cerrar la sesión actual?</p>
            <div className="modal-actions">
              <button className="btn btn-ghost" onClick={cancelLogout}>Cancelar</button>
              <button className="btn btn-primary" onClick={confirmLogout}>Aceptar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
