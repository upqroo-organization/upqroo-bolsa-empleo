import ConverterClient from "./converter";

export default function Page() {
  return (
    <main className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Currency Converter (USD → MXN)</h1>
      <ConverterClient />
    </main>
  );
}
