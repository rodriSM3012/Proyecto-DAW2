import { useEffect, useMemo, useRef } from "react";
import { Html5Qrcode } from "html5-qrcode";

function randomDomId(prefix) {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return `${prefix}-${crypto.randomUUID()}`;
  }
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

/**
 * Vista previa por cámara (html5-qrcode). Llama `onDecoded` con el texto leído.
 * Si `paused` es true, detiene la cámara hasta que vuelva a false (p.ej. tras cargar producto).
 */
export default function QRScanner({ onDecoded, onCameraError, paused = false }) {
  const containerId = useMemo(() => randomDomId("h5qr"), []);
  const scannerRef = useRef(null);
  const onDecodedRef = useRef(onDecoded);
  const onCameraErrorRef = useRef(onCameraError);

  useEffect(() => {
    onDecodedRef.current = onDecoded;
  }, [onDecoded]);

  useEffect(() => {
    onCameraErrorRef.current = onCameraError;
  }, [onCameraError]);

  useEffect(() => {
    if (paused) {
      const scanner = scannerRef.current;
      if (scanner) {
        scanner
          .stop()
          .then(() => scanner.clear())
          .catch(() => {});
      }
      scannerRef.current = null;
      return;
    }

    let cancelled = false;
    let instance = null;
    const id = containerId;

    async function run() {
      try {
        instance = new Html5Qrcode(id, { verbose: false });
        scannerRef.current = instance;

        await instance.start(
          { facingMode: "environment" },
          { fps: 10, qrbox: { width: 240, height: 240 }, aspectRatio: 1 },
          (text) => {
            if (!cancelled && typeof text === "string" && text.trim()) {
              onDecodedRef.current(text.trim());
            }
          },
          () => {},
        );
      } catch (err) {
        console.warn("QR camera start:", err.message || err);
        const msg = typeof err?.message === "string" ? err.message : "No se pudo acceder a la cámara.";
        if (!cancelled && typeof onCameraErrorRef.current === "function") {
          onCameraErrorRef.current(msg);
        }
      }
    }

    run();

    return () => {
      cancelled = true;
      if (instance) {
        instance
          .stop()
          .then(() => instance.clear())
          .catch(() => {});
      }
      if (scannerRef.current === instance) {
        scannerRef.current = null;
      }
    };
  }, [paused, containerId]);

  return (
    <div className="qr-scanner-shell">
      <div id={containerId} className="qr-reader-mount" />
    </div>
  );
}
