"use client";

import { useState } from "react";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const handleSendEmail = async () => {
    setLoading(true);
    setResult(null);
    try {
      const response = await fetch("/api/mail", {
        method: "POST",
      });
      const data = await response.json();
      if (data.success) {
        setResult(`✅ Correo enviado. ID: ${data.messageId}`);
      } else {
        setResult(`❌ Error: ${JSON.stringify(data.error)}`);
      }
    } catch (err) {
      setResult("❌ Error al enviar el correo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ padding: "2rem" }}>
      <h1>Enviar correo de prueba</h1>
      <button
        onClick={handleSendEmail}
        disabled={loading}
        style={{
          padding: "0.5rem 1rem",
          backgroundColor: "#0070f3",
          color: "#fff",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        {loading ? "Enviando..." : "Enviar correo"}
      </button>
      {result && <p style={{ marginTop: "1rem" }}>{result}</p>}
    </main>
  );
}
