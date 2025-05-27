import React from "react";
import useEventoData from "../../Hooks/userEventoData";
import Card from "../../components/Card/Card";

const TotalEventosCard = () => {
  const { dados, loading } = useEventoData();

  const totalEventos = dados.length;

  return (
    <Card title="Total de Eventos" value={loading ? "Carregando..." : totalEventos} />
  );
};

export default TotalEventosCard;
