import { VacanteInterface } from "@/types/vacantes";
import { useEffect, useState } from "react";

export default function useVacante(id: string | null) {
  const [vacante, setVacante] = useState<VacanteInterface | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setVacante(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    fetch(`/api/vacantes/${id}`)
      .then(async (res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        setVacante(data);
      })
      .catch((err) => {
        console.error('Error fetching vacante:', err);
        setError('Error al cargar la vacante');
        setVacante(null);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [id]);

  return {
    vacante,
    isLoading,
    error
  };
}