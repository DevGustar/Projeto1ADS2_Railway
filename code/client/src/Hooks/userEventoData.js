import { useEffect, useState } from "react";

export default function useEventoData() {
  const [dados, setDados] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("http://localhost:3000/api/dataeventos");
        const json = await res.json();
        setDados(json);
      } catch (error) {
        console.error("Erro ao buscar eventos:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return { dados, loading };
}
