import { useCallback, useState } from "react";
import QRScanner from "../components/QRScanner.jsx";
import { decodeQrFromFile } from "../utils/decodeQrFromFile.js";
import ProductCard from "../components/ProductCard.jsx";
import api from "../services/api.js";
import { useAuth } from "../context/AuthContext.jsx";

function validateMovementQuantity(tipo, raw) {
  const n = Number(raw);
  if (!Number.isInteger(n) || n === 0) {
    return { ok: false, message: "La cantidad debe ser un número entero distinto de cero." };
  }
  if ((tipo === "entrada" || tipo === "salida") && n < 1) {
    return { ok: false, message: "En entrada/salida la cantidad debe ser positiva." };
  }
  return { ok: true, value: n };
}

export default function ScannerPage() {
  const { hasRole } = useAuth();
  const admin = hasRole("admin");

  const [product, setProduct] = useState(null);
  const [loadingLookup, setLoadingLookup] = useState(false);
  const [toast, setToast] = useState(null);
  const [cameraPaused, setCameraPaused] = useState(false);
  const [cameraHint, setCameraHint] = useState("");

  const [manualCode, setManualCode] = useState("");
  const [tipoMovimiento, setTipoMovimiento] = useState("entrada");
  const [cantidad, setCantidad] = useState("");
  const [detalle, setDetalle] = useState("");
  const [submittingMovement, setSubmittingMovement] = useState(false);

  const tipoInForm = tipoMovimiento === "ajuste" && !admin ? "entrada" : tipoMovimiento;

  const showToast = useCallback((kind, msg) => {
    setToast({ kind, msg });
    window.setTimeout(() => setToast(null), 4500);
  }, []);

  const resolveProductFromCode = useCallback(
    async (code) => {
      const trimmed = String(code || "").trim();
      if (!trimmed) {
        showToast("error", "Introduce un código QR o UUID válido.");
        return;
      }
      setLoadingLookup(true);
      setCameraPaused(true);
      try {
        const res = await api.get(`/api/products/by-qr/${encodeURIComponent(trimmed)}`);
        const p = res.data?.product;
        if (!p) {
          setProduct(null);
          showToast("error", "Producto no encontrado para este código.");
          setCameraPaused(false);
          return;
        }
        setProduct(p);
        setManualCode(trimmed);
        showToast("success", `Producto identificado: ${p.nombre}`);
      } catch (err) {
        setProduct(null);
        const backend = err.response?.data?.error;
        showToast("error", backend || "No se ha podido obtener el producto.");
        setCameraPaused(false);
      } finally {
        setLoadingLookup(false);
      }
    },
    [showToast],
  );

  const onDecoded = useCallback(
    (text) => {
      if (loadingLookup) return;
      void resolveProductFromCode(text);
    },
    [loadingLookup, resolveProductFromCode],
  );

  const onCameraErrorMsg = useCallback((msg) => {
    setCameraHint(msg || "Sin acceso a la cámara. Usa entrada manual o archivo.");
  }, []);

  const handleManualSubmit = (e) => {
    e.preventDefault();
    void resolveProductFromCode(manualCode);
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file || loadingLookup) return;
    try {
      setCameraPaused(true);
      const text = await decodeQrFromFile(file);
      await resolveProductFromCode(text);
    } catch {
      showToast("error", "No se ha podido leer el código en la imagen.");
      setCameraPaused(false);
    }
  };

  const handleClearSelection = () => {
    setProduct(null);
    setManualCode("");
    setCantidad("");
    setDetalle("");
    setTipoMovimiento("entrada");
    setCameraPaused(false);
  };

  const handleMovementSubmit = async (e) => {
    e.preventDefault();
    if (!product) return;

    if (tipoMovimiento === "ajuste" && !admin) {
      showToast("error", "Solo administradores pueden registrar ajustes.");
      return;
    }

    const qtyCheck = validateMovementQuantity(tipoMovimiento, cantidad);
    if (!qtyCheck.ok) {
      showToast("error", qtyCheck.message);
      return;
    }

    setSubmittingMovement(true);
    try {
      const res = await api.post("/api/movimientos", {
        producto_id: product.id,
        tipo: tipoMovimiento,
        cantidad: qtyCheck.value,
        detalle: detalle.trim() || undefined,
      });
      const newStock = res.data?.stock_actual;
      if (newStock != null && newStock !== "") {
        setProduct((prev) => (prev ? { ...prev, stock_actual: Number(newStock) } : prev));
      }
      showToast("success", res.data?.message || "Movimiento registrado correctamente.");
      setCantidad("");
      setDetalle("");
    } catch (err) {
      const backend = err.response?.data?.error;
      showToast("error", backend || "No se ha podido registrar el movimiento.");
    } finally {
      setSubmittingMovement(false);
    }
  };

  return (
    <section className="dashboard-grid">
      {toast && (
        <div className={`toast-banner ${toast.kind === "success" ? "toast-success" : "toast-error"}`} role="status">
          {toast.msg}
        </div>
      )}

      <section className="card">
        <h2>Escaneo QR y movimiento</h2>
        <p className="card-text">
          Escanea el código del producto, sube una imagen con el QR o introduce el UUID manualmente. Solo operadores y
          administradores registran movimientos.
        </p>
      </section>

      {!product ? (
        <>
          <section className="card">
            <h3 className="section-title">Cámara</h3>
            {cameraHint ? <p className="muted">{cameraHint}</p> : null}
            {!loadingLookup ? (
              <QRScanner onDecoded={onDecoded} paused={cameraPaused} onCameraError={onCameraErrorMsg} />
            ) : (
              <p>Buscando producto...</p>
            )}
          </section>

          <section className="card">
            <h3 className="section-title">Imagen guardada</h3>
            <input type="file" accept="image/*" onChange={(ev) => void handleFileChange(ev)} disabled={loadingLookup} />
          </section>

          <section className="card">
            <h3 className="section-title">Entrada manual (UUID)</h3>
            <form className="form-grid manual-qr-form" onSubmit={handleManualSubmit}>
              <label className="form-field span-2">
                <span>Código QR / UUID del producto</span>
                <input
                  value={manualCode}
                  onChange={(ev) => setManualCode(ev.target.value)}
                  placeholder="Ej. uuid del producto"
                  autoComplete="off"
                />
              </label>
              <button type="submit" className="btn btn-primary" disabled={loadingLookup}>
                {loadingLookup ? "Consultando..." : "Buscar producto"}
              </button>
            </form>
          </section>
        </>
      ) : (
        <>
          <section className="card">
            <div className="catalog-toolbar">
              <div>
                <h3 className="section-title">Producto seleccionado</h3>
              </div>
              <button type="button" className="btn btn-ghost" onClick={handleClearSelection}>
                Escanear otro
              </button>
            </div>
            <ProductCard product={product} />
          </section>

          <section className="card">
            <h3 className="section-title">Registrar movimiento</h3>
            <form className="form-grid product-form-grid movement-form" onSubmit={handleMovementSubmit}>
              <label className="form-field">
                <span>Tipo</span>
                <select value={tipoInForm} onChange={(ev) => setTipoMovimiento(ev.target.value)}>
                  <option value="entrada">Entrada</option>
                  <option value="salida">Salida</option>
                  {admin ? <option value="ajuste">Ajuste (solo admin)</option> : null}
                </select>
              </label>
              <label className="form-field">
                <span>Cantidad</span>
                <input
                  type="number"
                  step={tipoMovimiento === "ajuste" ? "1" : "1"}
                  value={cantidad}
                  onChange={(ev) => setCantidad(ev.target.value)}
                  placeholder={tipoMovimiento === "ajuste" ? "Puede ser negativa" : "Ej. 5"}
                  required
                />
              </label>
              <label className="form-field span-2">
                <span>Detalle (opcional)</span>
                <textarea
                  className="input-textarea"
                  rows={2}
                  value={detalle}
                  onChange={(ev) => setDetalle(ev.target.value)}
                />
              </label>
              <button type="submit" className="btn btn-primary" disabled={submittingMovement}>
                {submittingMovement ? "Guardando..." : "Registrar movimiento"}
              </button>
            </form>
            {tipoMovimiento === "ajuste" && admin ? (
              <p className="muted small-print">
                Ajuste de inventario: cantidad puede ser positiva o negativa (no cero).
              </p>
            ) : null}
          </section>
        </>
      )}
    </section>
  );
}
