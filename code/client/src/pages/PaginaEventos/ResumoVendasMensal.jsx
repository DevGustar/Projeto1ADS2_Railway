import React, { useState, useMemo } from 'react';
import { eventos, resumoVendas } from './db.js';
import {
  BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, 
  Tooltip, ResponsiveContainer, CartesianGrid, Legend, AreaChart, Area
} from 'recharts';
import {
  FiArrowLeft,
  FiSearch,
  FiCalendar,
  FiFilter,
  FiDollarSign,
  FiUsers,
  FiPieChart,
  FiTrendingUp,
  FiPercent
} from "react-icons/fi";
import './vendas.css';

// Utilitários
const formatMesAno = (dataStr) => {
  const data = new Date(dataStr);
  const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
  return `${meses[data.getMonth()]}/${data.getFullYear()}`;
};

const formatarMoeda = (valor) => new Intl.NumberFormat('pt-BR', { 
  style: 'currency', 
  currency: 'BRL' 
}).format(valor);

// Cores para os gráficos
const CORES = {
  segmentos: ['#0f8f8a', '#FF254A', '#4F4F4F' ,'#D3C00D'],
  faixas: ['#1f8f81', '#FF254A', '#4F4F4F' ,'#D3C00D', '#0f8f8a', '#D3C00D']
};

export default function DashboardVendasMensal({ onVoltar }) {
  const [segmentoSelecionado, setSegmentoSelecionado] = useState('Todos');
  const [intervaloData, setIntervaloData] = useState('12meses');

  // Processamento dos dados
  const { dadosCompletos, segmentosUnicos, dadosFiltrados, dadosAgrupados, dadosOrdenados } = useMemo(() => {
    // Dados completos com mesAno, segmento e faixaEtaria
    const dadosCompletos = resumoVendas.map(r => {
      const ev = eventos.find(e => e.id === r.eventoId);
      return {
        ...r,
        mesAno: ev?.data ? formatMesAno(ev.data) : 'Data desconhecida',
        segmento: ev?.segmento || 'Desconhecido',
        faixaEtaria: ev?.faixaEtaria || 'Desconhecida',
        dataEvento: ev?.data ? new Date(ev.data) : null
      };
    });

    // Segmentos únicos para filtro
    const segmentosUnicos = ['Todos', ...Array.from(new Set(dadosCompletos.map(d => d.segmento)))];

    // Filtra por segmento e intervalo de tempo
    const hoje = new Date();
    let dataLimite = new Date(0); // Data mínima
    
    if (intervaloData === '6meses') {
      dataLimite = new Date(hoje.setMonth(hoje.getMonth() - 6));
    } else if (intervaloData === '12meses') {
      dataLimite = new Date(hoje.setMonth(hoje.getMonth() - 12));
    }

    const dadosFiltrados = dadosCompletos.filter(d => {
      const filtroSegmento = segmentoSelecionado === 'Todos' || d.segmento === segmentoSelecionado;
      const filtroData = intervaloData === 'todos' || (d.dataEvento && d.dataEvento >= dataLimite);
      return filtroSegmento && filtroData;
    });

    // Agrupa por mesAno para tabela e gráfico
    const agrupado = {};
    dadosFiltrados.forEach(d => {
      if (!agrupado[d.mesAno]) {
        agrupado[d.mesAno] = {
          mesAno: d.mesAno,
          totalFaturado: 0,
          quantidadeEventos: 0,
          totalIngressos: 0,
          faixasEtarias: new Set(),
          dataOrdenacao: d.dataEvento ? new Date(d.dataEvento.getFullYear(), d.dataEvento.getMonth(), 1) : new Date(0)
        };
      }
      agrupado[d.mesAno].totalFaturado += d.valorTotal;
      agrupado[d.mesAno].quantidadeEventos += 1;
      agrupado[d.mesAno].totalIngressos += d.totalVendas;
      agrupado[d.mesAno].faixasEtarias.add(d.faixaEtaria);
    });

    const dadosAgrupados = Object.values(agrupado);
    
    // Ordena os meses
    const dadosOrdenados = [...dadosAgrupados].sort((a, b) => a.dataOrdenacao - b.dataOrdenacao)
      .map(({ dataOrdenacao, ...rest }) => ({
        ...rest,
        faixasEtarias: Array.from(rest.faixasEtarias).join(', ')
      }));

    return { dadosCompletos, segmentosUnicos, dadosFiltrados, dadosAgrupados, dadosOrdenados };
  }, [segmentoSelecionado, intervaloData]);

  // Dados para gráficos
  const dadosGraficos = useMemo(() => {
    // Ingressos por segmento/faixa
    const ingressosPorSegmentoFaixa = {};
    dadosFiltrados.forEach(d => {
      const chave = `${d.segmento} / ${d.faixaEtaria}`;
      ingressosPorSegmentoFaixa[chave] = (ingressosPorSegmentoFaixa[chave] || 0) + d.totalVendas;
    });

    // Faturamento por segmento
    const faturamentoPorSegmento = {};
    dadosFiltrados.forEach(d => {
      faturamentoPorSegmento[d.segmento] = (faturamentoPorSegmento[d.segmento] || 0) + d.valorTotal;
    });

    // Evolução mensal
    const evolucaoMensal = dadosOrdenados.map(mes => ({
      mesAno: mes.mesAno,
      faturamento: mes.totalFaturado,
      ingressos: mes.totalIngressos,
      eventos: mes.quantidadeEventos
    }));

    return {
      ingressosPorSegmentoFaixa: Object.entries(ingressosPorSegmentoFaixa).map(([name, value]) => ({ name, value })),
      faturamentoPorSegmento: Object.entries(faturamentoPorSegmento).map(([name, value]) => ({ name, value })),
      evolucaoMensal
    };
  }, [dadosFiltrados, dadosOrdenados]);

  // Métricas resumidas
  const metricas = useMemo(() => {
    return dadosFiltrados.reduce((acc, d) => ({
      totalFaturado: acc.totalFaturado + d.valorTotal,
      totalIngressos: acc.totalIngressos + d.totalVendas,
      totalEventos: acc.totalEventos + 1
    }), { totalFaturado: 0, totalIngressos: 0, totalEventos: 0 });
  }, [dadosFiltrados]);

  return (
    <div className="ev-dashboard-container">
      {/* Cabeçalho */}
      <header className="ev-dashboard-header">
        <button className="btn-voltar" onClick={onVoltar}>
          <i className="fas fa-arrow-left"></i> Voltar
        </button>
        <h1>Análise Mensal de Vendas</h1>
        <div className="filtro-data">
           
          <select 
            value={intervaloData} 
            onChange={(e) => setIntervaloData(e.target.value)}
          >
            <option value="6meses">Últimos 6 meses</option>
            <option value="12meses">Últimos 12 meses</option>
            <option value="todos">Todo o período</option>
          </select>
        </div>
      </header>

      {/* Filtros */}
      <div className="ev-filtros-container">
        <div className="ev-filtro-item">
           <FiFilter className="ev-select-icon" />
          <label htmlFor="segmento">Segmento:</label>
          <select
            id="segmento"
            value={segmentoSelecionado}
            onChange={(e) => setSegmentoSelecionado(e.target.value)}
          >
            {segmentosUnicos.map(seg => (
              <option key={seg} value={seg}>{seg}</option>
            ))}
          </select>
        </div>
      </div>

      {/* KPIs */}
      <div className="kpi-container">
        <div className="kpi-card">
          <div className="kpi-icon">
             <FiCalendar />
            <i className="fas fa-calendar-alt"></i>
          </div>
          <div className="kpi-content">
            <h3>Período Analisado</h3>
            <p>{intervaloData === '6meses' ? '6 meses' : intervaloData === '12meses' ? '12 meses' : 'Todo período'}</p>
          </div>
        </div>
        
        <div className="kpi-card">
          <div className="kpi-icon">
             <FiUsers />
            <i className="fas fa-ticket-alt"></i>
          </div>
          <div className="kpi-content">
            <h3>Ingressos Vendidos</h3>
            <p>{metricas.totalIngressos}</p>
          </div>
        </div>
        
        <div className="kpi-card">
          <div className="kpi-icon">
             <FiDollarSign />
            <i className="fas fa-money-bill-wave"></i>
          </div>
          <div className="kpi-content">
            <h3>Faturamento Total</h3>
            <p>{formatarMoeda(metricas.totalFaturado)}</p>
          </div>
        </div>
        
        <div className="kpi-card">
          <div className="kpi-icon">
             <FiCalendar />
            <i className="fas fa-chart-line"></i>
          </div>
          <div className="kpi-content">
            <h3>Eventos Realizados</h3>
            <p>{metricas.totalEventos}</p>
          </div>
        </div>
      </div>

      {/* Gráfico de Evolução Mensal */}
      <div className="grafico-card full-width">
        <h3>Evolução Mensal</h3>
        <div className="grafico-wrapper">
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={dadosGraficos.evolucaoMensal}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="mesAno" />
              <YAxis yAxisId="left" orientation="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip 
                formatter={(value, name) => 
                  name === 'faturamento' ? [formatarMoeda(value), 'Faturamento'] : [value, name]
                }
              />
              <Legend />
              <Area 
                yAxisId="left"
                type="monotone" 
                dataKey="faturamento" 
                name="Faturamento" 
                stroke="#4F4F4F" 
                fill="#BBFBF9" 
                fillOpacity={0.2} 
              />
              <Area 
                yAxisId="right"
                type="monotone" 
                dataKey="ingressos" 
                name="Ingressos" 
                stroke="#a51a31" 
                fill="#FF254A" 
                fillOpacity={0.2} 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Gráficos de Pizza */}
      <div className="ev-graficos-container">
        <div className="grafico-card">
          <h3>Distribuição de Ingressos</h3>
          <div className="grafico-wrapper">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={dadosGraficos.ingressosPorSegmentoFaixa}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={({ name, percent }) => `${name.split('/')[0]} (${(percent * 100).toFixed(0)}%)`}
                >
                  {dadosGraficos.ingressosPorSegmentoFaixa.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={CORES.faixas[index % CORES.faixas.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value} ingressos`, 'Quantidade']} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grafico-card">
          <h3>Distribuição de Faturamento</h3>
          <div className="grafico-wrapper">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={dadosGraficos.faturamentoPorSegmento}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                >
                  {dadosGraficos.faturamentoPorSegmento.map((_, index) => (
                    <Cell key={`cell-s-${index}`} fill={CORES.segmentos[index % CORES.segmentos.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [formatarMoeda(value), 'Faturamento']} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Tabela Detalhada */}
      <div className="tabela-container">
        <div className="tabela-header">
          <h3>Detalhamento por Mês</h3>
          <span className="total-registros">
            Exibindo {dadosOrdenados.length} meses
          </span>
        </div>
        
        <div className="tabela-wrapper">
          <table className="tabela-dados">
            <thead>
              <tr>
                <th>Mês/Ano</th>
                <th>Faturamento</th>
                <th>Eventos</th>
                <th>Ingressos</th>
                <th>Faixas Etárias</th>
              </tr>
            </thead>
            <tbody>
              {dadosOrdenados.length > 0 ? (
                dadosOrdenados.map((mes, index) => (
                  <tr key={index}>
                    <td>{mes.mesAno}</td>
                    <td className="valor">{formatarMoeda(mes.totalFaturado)}</td>
                    <td>{mes.quantidadeEventos}</td>
                    <td>{mes.totalIngressos}</td>
                    <td>{mes.faixasEtarias}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="sem-dados">
                    Nenhum dado encontrado com os filtros atuais
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}