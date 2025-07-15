"use client";

import { useState } from "react";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [email, setEmail] = useState("");

  const handleSendEmail = async () => {
    setLoading(true);
    setResult(null);
    try {
      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to: email }),
      });
      const data = await response.json();
      if (data.success) {
        setResult(`✅ Correo enviado correctamente. ID: ${data.messageId}`);
      } else {
        setResult(`❌ Error: ${data.error}`);
      }
    } catch (err) {
      setResult("❌ Error al enviar el correo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ padding: "2rem" }}>
      <h1>Enviar correo dinámico</h1>

      <input
        type="email"
        placeholder="Correo destinatario"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="border p-2 rounded w-full max-w-md my-4"
      />

      <button
        onClick={handleSendEmail}
        disabled={loading || !email}
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
