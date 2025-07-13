"use client";

import { useEffect, useState } from "react";

export default function ConverterClient() {
  const [rate, setRate] = useState<number | null>(null);
  const [usd, setUsd] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/exchange-rate")
      .then((res) => res.json())
      .then((data) => {
        setRate(data.rate);
        setLoading(false);
      })
      .catch(() => {
        setRate(null);
        setLoading(false);
      });
  }, []);

  function handleConvert(e: React.FormEvent) {
    e.preventDefault();
    const amount = parseFloat(usd);
    if (!rate || isNaN(amount)) {
      setResult(null);
      return;
    }
    setResult((amount * rate).toFixed(2));
  }

  if (loading) return <p>Loading exchange rate…</p>;
  if (!rate) return <p>Failed to load exchange rate.</p>;

  return (
    <form onSubmit={handleConvert} className="space-y-4 mt-4">
      <p>
        Current USD → MXN rate: <strong>{rate}</strong>
      </p>
      <input
        name="usd"
        type="number"
        step="0.01"
        placeholder="Amount in USD"
        className="border px-3 py-2 rounded w-full"
        required
        value={usd}
        onChange={(e) => setUsd(e.target.value)}
      />
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Convert
      </button>

      {result && (
        <div className="mt-4">
          <p>
            <strong>{usd}</strong> USD =
            <strong> {result}</strong> MXN
          </p>
        </div>
      )}
    </form>
  );
}
