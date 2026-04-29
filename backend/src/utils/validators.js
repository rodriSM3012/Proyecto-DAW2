const validator = require("validator");

function sanitizeText(input) {
  return validator.escape(String(input || "").trim());
}

function validateRegisterPayload(payload) {
  const name = sanitizeText(payload.name);
  const email = String(payload.email || "").trim().toLowerCase();
  const password = String(payload.password || "");
  const role = sanitizeText(payload.role || "operador");

  if (!name || name.length < 2) {
    return { ok: false, message: "Name must contain at least 2 characters." };
  }

  if (!validator.isEmail(email)) {
    return { ok: false, message: "Invalid email format." };
  }

  if (!validator.isStrongPassword(password, { minLength: 8, minSymbols: 0 })) {
    return {
      ok: false,
      message: "Password must be at least 8 chars with upper, lower and number."
    };
  }

  return {
    ok: true,
    data: { name, email, password, role }
  };
}

function validateLoginPayload(payload) {
  const email = String(payload.email || "").trim().toLowerCase();
  const password = String(payload.password || "");

  if (!validator.isEmail(email)) {
    return { ok: false, message: "Invalid email format." };
  }

  if (!password) {
    return { ok: false, message: "Password is required." };
  }

  return {
    ok: true,
    data: { email, password }
  };
}

module.exports = {
  sanitizeText,
  validateRegisterPayload,
  validateLoginPayload
};
