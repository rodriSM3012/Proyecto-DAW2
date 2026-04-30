import pkg from "validator";
const { escape, isEmail, isStrongPassword } = pkg;

function sanitizeText(input) {
  return escape(String(input || "").trim());
}

export function validateRegisterPayload(payload) {
  const name = sanitizeText(payload.name);
  const email = String(payload.email || "")
    .trim()
    .toLowerCase();
  const password = String(payload.password || "");
  const role = sanitizeText(payload.role || "operador");

  if (!name || name.length < 2) {
    return { ok: false, message: "Name must contain at least 2 characters." };
  }

  if (!isEmail(email)) {
    return { ok: false, message: "Invalid email format." };
  }

  if (!isStrongPassword(password, { minLength: 8, minSymbols: 0 })) {
    return {
      ok: false,
      message:
        "Password must be at least 8 chars with upper, lower and number.",
    };
  }

  return {
    ok: true,
    data: { name, email, password, role },
  };
}

export function validateLoginPayload(payload) {
  const email = String(payload.email || "")
    .trim()
    .toLowerCase();
  const password = String(payload.password || "");

  if (!isEmail(email)) {
    return { ok: false, message: "Invalid email format." };
  }

  if (!password) {
    return { ok: false, message: "Password is required." };
  }

  return {
    ok: true,
    data: { email, password },
  };
}

function normalizeCategoria(input) {
  return String(input || "C")
    .trim()
    .toUpperCase();
}

function parseNonNegativeNumber(value) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed < 0) {
    return null;
  }
  return parsed;
}

function parseNonNegativeInteger(value) {
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < 0) {
    return null;
  }
  return parsed;
}

export function validateCreateProductPayload(payload) {
  const nombre = sanitizeText(payload.nombre);
  const descripcion = sanitizeText(payload.descripcion || "");
  const precio_unitario = parseNonNegativeNumber(payload.precio_unitario);
  const stock_actual = parseNonNegativeInteger(payload.stock_actual);
  const stock_minimo = parseNonNegativeInteger(payload.stock_minimo);
  const categoria_abc = normalizeCategoria(payload.categoria_abc);

  if (!nombre || nombre.length < 2) {
    return { ok: false, message: "Product name is required." };
  }
  if (precio_unitario === null) {
    return { ok: false, message: "precio_unitario must be a non-negative number." };
  }
  if (stock_actual === null) {
    return { ok: false, message: "stock_actual must be a non-negative integer." };
  }
  if (stock_minimo === null) {
    return { ok: false, message: "stock_minimo must be a non-negative integer." };
  }
  if (!["A", "B", "C"].includes(categoria_abc)) {
    return { ok: false, message: "categoria_abc must be A, B or C." };
  }

  return {
    ok: true,
    data: {
      nombre,
      descripcion,
      precio_unitario,
      stock_actual,
      stock_minimo,
      categoria_abc,
    },
  };
}

export function validateUpdateProductPayload(payload) {
  return validateCreateProductPayload(payload);
}
