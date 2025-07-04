import { VacanteInterface } from "@/types/vacantes";
import { useEffect, useState } from "react"

export default function useVacantes() {
  const [vacantes, setVacantes] = useState<VacanteInterface[]>([]);
  const [total, setTotal] = useState<number|null|undefined>(0);

  console.log(vacantes);
  
  useEffect(() => {
    fetch('/api/vacantes')
      .then(res => res.json())
      .then(val => {
        setVacantes(val.data)
        setTotal(val?.total)
      })
      .catch(() => {
        console.log('Error')
      })
  }, [])

  return {
    vacantes,
    total
  }
}
