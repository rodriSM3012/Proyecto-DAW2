import { Html5Qrcode } from "html5-qrcode";

function randomDomId(prefix) {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return `${prefix}-${crypto.randomUUID()}`;
  }
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

/**
 * Escanea un código QR desde un archivo usando un contenedor DOM temporal.
 */
export async function decodeQrFromFile(file) {
  const id = randomDomId("h5qr-file");
  const mount = typeof document !== "undefined" ? document.createElement("div") : null;
  if (!mount) {
    throw new Error("Solo navegador");
  }

  mount.id = id;
  mount.style.position = "fixed";
  mount.style.pointerEvents = "none";
  mount.style.opacity = "0";
  mount.style.left = "-9999px";
  mount.style.top = "-9999px";
  mount.style.width = "300px";
  mount.style.height = "300px";
  document.body.appendChild(mount);

  const qr = new Html5Qrcode(id, { verbose: false });
  try {
    const text = await qr.scanFile(file, false);
    return String(text || "").trim();
  } finally {
    try {
      await qr.clear();
    } catch {
      /* ignore */
    }
    mount.remove();
  }
}
