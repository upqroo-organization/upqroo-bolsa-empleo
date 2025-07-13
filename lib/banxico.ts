const API_URL =
  "https://www.banxico.org.mx/SieAPIRest/service/v1/series/SF63528/datos/oportuno";

export async function getUsdMxnRate(): Promise<number> {
  const token = process.env.BANXICO_API_KEY;
  if (!token) {
    throw new Error("Missing BANXICO_API_KEY in environment variables.");
  }

  const res = await fetch(API_URL, {
    headers: { "Bmx-Token": token },
    next: { tags: ["usd-mxn"], revalidate: 3600 },
  });

  if (!res.ok) {
    throw new Error(`Banxico API error: ${res.status}`);
  }

  const data = await res.json();

  const rateStr =
    data.bmx.series[0].datos[0].dato.replace(",", "."); // Banxico sometimes returns comma
  const rate = parseFloat(rateStr);

  if (isNaN(rate)) {
    throw new Error("Failed to parse exchange rate.");
  }

  return rate;
}
