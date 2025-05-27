import React from "react";
import useEventoData from "../../Hooks/userEventoData";
import Card from "../../components/Card/Card";

function ValorTipoEvento({ tipo }) {
  const { dados, loading } = useEventoData();

  // Filtra os eventos do tipo especificado
  const eventosFiltrados = dados.filter((evento) =>
    evento.tipo.toLowerCase() === tipo.toLowerCase()
  );

  // Soma o valor arrecadado: preco * qtd_ingressoes
  const totalValor = eventosFiltrados.reduce((total, evento) => {
    const preco = parseFloat(evento.preco) || 0;
    const ingressos = evento.qtd_ingressoes || 0;
    return total + preco * ingressos;
  }, 0);

  const valorFormatado = `R$ ${totalValor.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
  })}`;

  return (
    <Card
      title={`Total em ${tipo}`}
      value={loading ? "Carregando..." : valorFormatado}
    />
  );
}

export default ValorTipoEvento;
