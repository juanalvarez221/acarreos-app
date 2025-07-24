import { useEffect, useState } from "react";

export default function usePersistedState(key, initialValue) {
  const [state, setState] = useState(() => {
    try {
      const value = window.localStorage.getItem(key);
      const parsed = value ? JSON.parse(value) : initialValue;
      // Siempre regresa array si initialValue es array
      if (Array.isArray(initialValue) && !Array.isArray(parsed)) return [];
      return parsed;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(state));
    } catch {}
  }, [key, state]);

  return [state, setState];
}
