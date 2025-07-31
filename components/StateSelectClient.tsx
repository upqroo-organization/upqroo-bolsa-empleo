'use client'

import { useState, useEffect } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface State {
  id: number;
  name: string;
}

interface StateSelectClientProps {
  name?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
}

export default function StateSelectClient({
  name = "stateId",
  value,
  onValueChange,
  placeholder = "Selecciona un estado"
}: StateSelectClientProps) {
  const [states, setStates] = useState<State[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStates = async () => {
      try {
        const response = await fetch('/api/states');
        const data = await response.json();
        if (data.success) {
          setStates(data.data);
        }
      } catch (error) {
        console.error('Error fetching states:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStates();
  }, []);

  if (loading) {
    return (
      <Select disabled>
        <SelectTrigger>
          <SelectValue placeholder="Cargando estados..." />
        </SelectTrigger>
      </Select>
    );
  }

  return (
    <Select name={name} value={value} onValueChange={onValueChange}>
      <SelectTrigger>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="none">Sin especificar</SelectItem>
        {states.map((state) => (
          <SelectItem key={state.id} value={state.id.toString()}>
            {state.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}