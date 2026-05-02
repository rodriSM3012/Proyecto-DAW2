import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../services/api.js";

const INITIAL_FORM = {
  nombre: "",
  descripcion: "",
  precio_unitario: "",
  stock_actual: "",
  stock_minimo: "",
  categoria_abc: "C",
};

function validateForm(form) {
  if (!form.nombre || form.nombre.trim().length < 2) {
    return "El nombre debe contener al menos 2 caracteres.";
  }

  const price = Number(form.precio_unitario);
  if (!Number.isFinite(price) || price < 0) {
    return "El precio unitario debe ser un número no negativo.";
  }

  const stockActual = Number(form.stock_actual);
  if (!Number.isInteger(stockActual) || stockActual < 0) {
    return "El stock actual debe ser un entero no negativo.";
  }

  const stockMinimo = Number(form.stock_minimo);
  if (!Number.isInteger(stockMinimo) || stockMinimo < 0) {
    return "El stock mínimo debe ser un entero no negativo.";
  }

  if (!["A", "B", "C"].includes(form.categoria_abc)) {
    return "La categoría ABC debe ser A, B o C.";
  }

  return "";
}

function toPayload(form) {
  return {
    nombre: form.nombre.trim(),
    descripcion: form.descripcion.trim(),
    precio_unitario: Number(form.precio_unitario),
    stock_actual: Number(form.stock_actual),
    stock_minimo: Number(form.stock_minimo),
    categoria_abc: form.categoria_abc,
  };
}

export default function ProductFormPage({ mode }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(INITIAL_FORM);
  const [loading, setLoading] = useState(mode === "edit");
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [isErrorFeedback, setIsErrorFeedback] = useState(false);

  const isEdit = mode === "edit";

  useEffect(() => {
    if (!isEdit) return;

    async function loadProduct() {
      setLoading(true);
      setFeedback("");
      try {
        const response = await api.get(`/api/products/${id}`);
        const product = response.data?.product;
        if (!product) throw new Error("Producto no encontrado.");
        setForm({
          nombre: product.nombre || "",
          descripcion: product.descripcion || "",
          precio_unitario: String(product.precio_unitario ?? ""),
          stock_actual: String(product.stock_actual ?? ""),
          stock_minimo: String(product.stock_minimo ?? ""),
          categoria_abc: product.categoria_abc || "C",
        });
      } catch (requestError) {
        const backendError = requestError.response?.data?.error;
        setIsErrorFeedback(true);
        setFeedback(backendError || requestError.message || "No se ha podido cargar el producto.");
      } finally {
        setLoading(false);
      }
    }

    loadProduct();
  }, [id, isEdit]);

  const validationError = useMemo(() => validateForm(form), [form]);
  const canSubmit = !validationError && !submitting;

  const onFieldChange = (field) => (event) => {
    const value = event.target.value;
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (validationError) {
      setIsErrorFeedback(true);
      setFeedback(validationError);
      return;
    }

    setSubmitting(true);
    setFeedback("");

    try {
      const payload = toPayload(form);
      if (isEdit) {
        await api.put(`/api/products/${id}`, payload);
        setIsErrorFeedback(false);
        setFeedback("Producto actualizado correctamente.");
        setTimeout(() => navigate(`/catalogo/${id}`), 900);
      } else {
        const response = await api.post("/api/products", payload);
        const newId = response.data?.product?.id;
        setIsErrorFeedback(false);
        setFeedback("Producto creado correctamente.");
        setTimeout(() => {
          if (newId) navigate(`/catalogo/${newId}`);
          else navigate("/catalogo");
        }, 900);
      }
    } catch (requestError) {
      const backendError = requestError.response?.data?.error;
      setIsErrorFeedback(true);
      setFeedback(backendError || "No se ha podido guardar el producto.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <section className="card">Cargando formulario...</section>;
  }

  return (
    <section className="dashboard-grid">
      <section className="card">
        <div className="catalog-toolbar">
          <div>
            <h2>{isEdit ? `Editar producto #${id}` : "Nuevo producto"}</h2>
            <p className="card-text">
              Formulario CRUD con validación en tiempo real para campos obligatorios y valores.
            </p>
          </div>
          <Link className="btn btn-ghost" to={isEdit ? `/catalogo/${id}` : "/catalogo"}>
            Cancelar
          </Link>
        </div>

        <form className="form-grid product-form-grid" onSubmit={handleSubmit}>
          <label className="form-field">
            <span>Nombre</span>
            <input
              value={form.nombre}
              onChange={onFieldChange("nombre")}
              placeholder="Nombre del producto"
              required
            />
          </label>

          <label className="form-field">
            <span>Descripción</span>
            <textarea
              className="input-textarea"
              value={form.descripcion}
              onChange={onFieldChange("descripcion")}
              placeholder="Descripción breve del producto"
              rows={4}
            />
          </label>

          <label className="form-field">
            <span>Precio unitario</span>
            <input
              type="number"
              min="0"
              step="0.01"
              value={form.precio_unitario}
              onChange={onFieldChange("precio_unitario")}
              required
            />
          </label>

          <label className="form-field">
            <span>Stock actual</span>
            <input
              type="number"
              min="0"
              step="1"
              value={form.stock_actual}
              onChange={onFieldChange("stock_actual")}
              required
            />
          </label>

          <label className="form-field">
            <span>Stock mínimo</span>
            <input
              type="number"
              min="0"
              step="1"
              value={form.stock_minimo}
              onChange={onFieldChange("stock_minimo")}
              required
            />
          </label>

          <label className="form-field">
            <span>Categoría ABC</span>
            <select value={form.categoria_abc} onChange={onFieldChange("categoria_abc")}>
              <option value="A">A</option>
              <option value="B">B</option>
              <option value="C">C</option>
            </select>
          </label>

          <button type="submit" className="btn btn-primary" disabled={!canSubmit}>
            {submitting ? "Guardando..." : isEdit ? "Guardar cambios" : "Crear producto"}
          </button>
        </form>
      </section>

      {(feedback || validationError) && (
        <p className={`feedback ${isErrorFeedback || validationError ? "error" : "success"}`}>
          {validationError || feedback}
        </p>
      )}
    </section>
  );
}
