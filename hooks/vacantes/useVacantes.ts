import { VacanteInterface } from "@/types/vacantes";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react"
import { useDebounce } from "../useDebounce";
import { toQueryString } from "@/utils/params";

export interface FiltersInterface {
  [key: string]: string | string[] | number;
  state: number,
  type: string[],
  career: string,
  modality: string[],
  salaryMax: string,
  salaryMin: string
}

const FILTER_INITIAL_STATE = {
    state: 0,
    career: "",
    type: [],
    modality: [],
    salaryMax: "",
    salaryMin: ""
  }

export default function useVacantes() {
  const searchParams = useSearchParams();
  const [vacantes, setVacantes] = useState<VacanteInterface[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [total, setTotal] = useState<number|null|undefined>(0);
  const [titleSearch, setTitleSearch] = useState<string>("")
  const [filters, setFilters] = useState<FiltersInterface>({
    state: !Number.isNaN(searchParams.get("estado")) ? Number(searchParams.get("estado")) : 0,
    career: "",
    type: [],
    modality: [],
    salaryMax: "",
    salaryMin: ""
  })
  const debouncedValue = useDebounce(titleSearch, 500);

  function resetFilters() {
    setFilters(FILTER_INITIAL_STATE)
  }

  function handleFilters(key: string, val: string | number | [string, string]): void {
    const value = val === "todos" ? "" : val;
    if(key === "title" && typeof value === "string") {
      setTitleSearch(value);
    } else {
      setFilters(prev => ({
        ...prev,
        [key]: value
      }))
    }
  }

  function handleCheckboxChange(key: string, value: string, checked: boolean) {
    if(key === 'type' || key === 'modality') {
      setFilters((prev: FiltersInterface) => {
        const prevChecked = prev[key];
        let newChecked = []
        if(checked) {
          newChecked = [...prevChecked, value]
        } else {
          newChecked = prevChecked.filter((val: string) => val !== value)
        }
        return {
          ...prev,
          [key]: newChecked
        }
      })
    }
  }
  
  useEffect(() => {
    const queryString = toQueryString({...filters, state: filters.state || undefined, title: debouncedValue}, { arrayFormat: 'brackets' });
    setIsLoading(true)

    fetch(`/api/vacantes?${queryString}`)
      .then(res => res.json())
      .then(val => {
        if(Array.isArray(val.data)) {
          setVacantes(val.data)
          setTotal(val?.total)
        }
      })
      .catch(() => {
        console.log('Error')
      })
      .finally(() => setIsLoading(false))
  }, [filters, debouncedValue])

  return {
    vacantes,
    total,
    filters,
    titleSearch,
    handleFilters,
    handleCheckboxChange,
    resetFilters,
    isLoading
  }
}
