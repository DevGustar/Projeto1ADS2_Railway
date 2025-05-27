import React, { useState, useMemo } from 'react';
import { eventos } from './db.js';
import {
  BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, 
  ResponsiveContainer, CartesianGrid, Legend, AreaChart, Area
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
import "./vendas.css";

// Cores para os gráficos
const COLORS = ['#0f8f8a', '#1CEAE4', '#FF254A', '#4F4F4F', '#D3C00D'];

// Gerar dados de vendas simulados
const gerarDadosVendas = (eventos) => {
  return eventos.map(evento => {
    const ingressosVendidos = Math.floor(Math.random() * 100) + 10;
    const valorIngresso = Math.floor(Math.random() * 50) + 10;
    const custo = valorIngresso * 0.6; // 60% do valor como custo
    const lucro = (valorIngresso - custo) * ingressosVendidos;
    
    return {
      ...evento,
      ingressosVendidos,
      valorIngresso,
      valorTotal: ingressosVendidos * valorIngresso,
      custoTotal: ingressosVendidos * custo,
      lucroTotal: lucro,
      ocupacao: Math.min(100, Math.floor((ingressosVendidos / 150) * 100)) // Capacidade de 150 ingressos
    };
  });
};

export default function DashboardVendas({ onVoltar }) {
  const [filtro, setFiltro] = useState('');
  const [segmentoFiltro, setSegmentoFiltro] = useState('');
  const [faixaEtariaFiltro, setFaixaEtariaFiltro] = useState('');
  const [intervaloData, setIntervaloData] = useState('todos');

  // Gerar e unificar dados
  const dadosUnificados = useMemo(() => gerarDadosVendas(eventos), []);
  
  // Filtrar dados
  const dadosFiltrados = useMemo(() => {
    const hoje = new Date();
    let dataLimite = new Date(0); // Data mínima
    
    if (intervaloData === '30dias') {
      dataLimite = new Date(hoje.setDate(hoje.getDate() - 30));
    } else if (intervaloData === '90dias') {
      dataLimite = new Date(hoje.setDate(hoje.getDate() - 90));
    }
    
    return dadosUnificados.filter(evento => {
      const dataEvento = new Date(evento.data);
      const filtroData = intervaloData === 'todos' || dataEvento >= dataLimite;
      const temaOk = evento.tema.toLowerCase().includes(filtro.toLowerCase());
      const segmentoOk = !segmentoFiltro || evento.segmento === segmentoFiltro;
      const faixaOk = !faixaEtariaFiltro || evento.faixaEtaria === faixaEtariaFiltro;
      
      return filtroData && temaOk && segmentoOk && faixaOk;
    });
  }, [dadosUnificados, filtro, segmentoFiltro, faixaEtariaFiltro, intervaloData]);

  // Dados para KPI cards
  const metricas = useMemo(() => {
    const totais = dadosFiltrados.reduce((acc, evento) => ({
      ingressos: acc.ingressos + evento.ingressosVendidos,
      faturamento: acc.faturamento + evento.valorTotal,
      custo: acc.custo + evento.custoTotal,
      lucro: acc.lucro + evento.lucroTotal,
      eventos: acc.eventos + 1
    }), { ingressos: 0, faturamento: 0, custo: 0, lucro: 0, eventos: 0 });

    return {
      ...totais,
      margem: totais.faturamento > 0 ? (totais.lucro / totais.faturamento) * 100 : 0,
      ocupacaoMedia: dadosFiltrados.length > 0 
        ? dadosFiltrados.reduce((sum, evento) => sum + evento.ocupacao, 0) / dadosFiltrados.length
        : 0
    };
  }, [dadosFiltrados]);

  // Dados para gráficos
  const dadosGraficos = useMemo(() => ({
    porSegmento: Object.entries(
      dadosFiltrados.reduce((acc, evento) => {
        acc[evento.segmento] = (acc[evento.segmento] || 0) + evento.valorTotal;
        return acc;
      }, {})
    ).map(([name, value]) => ({ name, value })),

    porFaixaEtaria: Object.entries(
      dadosFiltrados.reduce((acc, evento) => {
        acc[evento.faixaEtaria] = (acc[evento.faixaEtaria] || 0) + evento.valorTotal;
        return acc;
      }, {})
    ).map(([name, value]) => ({ name, value })),

    evolucaoMensal: Array.from({ length: 12 }, (_, i) => {
      const mes = i + 1;
      const eventosMes = dadosFiltrados.filter(e => new Date(e.data).getMonth() + 1 === mes);
      return {
        mes: new Date(2024, i, 1).toLocaleString('default', { month: 'short' }),
        faturamento: eventosMes.reduce((sum, e) => sum + e.valorTotal, 0),
        lucro: eventosMes.reduce((sum, e) => sum + e.lucroTotal, 0)
      };
    })
  }), [dadosFiltrados]);

  // Formatação de valores
  const formatarMoeda = (valor) => new Intl.NumberFormat('pt-BR', { 
    style: 'currency', 
    currency: 'BRL' 
  }).format(valor);

  const formatarPorcentagem = (valor) => `${valor.toFixed(1)}%`;

  return (
    <div className="ev-dashboard-container">
      {/* Cabeçalho */}
      <header className="ev-dashboard-header">
        <button className="btn-voltar" onClick={onVoltar}>
          <FiArrowLeft /> Voltar
        </button>
        <h1>Histórico de Vendas</h1>
        <div className="filtro-data">
          <select 
            value={intervaloData} 
            onChange={(e) => setIntervaloData(e.target.value)}
            className="filtro-periodo"
          >
            <option value="todos">Todo o período</option>
            <option value="30dias">Últimos 30 dias</option>
            <option value="90dias">Últimos 90 dias</option>
          </select>
        </div>
      </header>

      {/* Filtros */}
      <div className="ev-filtros-container">
        <div className="ev-filtro-item">
          <div className="input-group">
            <FiSearch className="input-icon" />
            <input
              type="text"
              placeholder="Buscar evento..."
              value={filtro}
              onChange={(e) => setFiltro(e.target.value)}
              className="filtro-texto"
            />
          </div>
        </div>
        
        <div className="ev-filtro-item">
          <FiFilter className="select-icon" />
          <select
            value={segmentoFiltro}
            onChange={(e) => setSegmentoFiltro(e.target.value)}
            className="filtro-segmento"
          >
            <option value="">Todos segmentos</option>
            <option value="Aprendizado">Aprendizado</option>
            <option value="Primeiro emprego">Primeiro emprego</option>
            <option value="Bem-estar">Bem-estar</option>
            <option value="Recolocação">Recolocação</option>
          </select>
        </div>
        
        <div className="ev-filtro-item">
          <FiUsers className="ev-select-icon" />
          <select
            value={faixaEtariaFiltro}
            onChange={(e) => setFaixaEtariaFiltro(e.target.value)}
            className="ev-filtro-faixa"
          >
            <option value="">Todas faixas</option>
            <option value="5–21 anos">5–21 anos</option>
            <option value="16–20 anos">16–20 anos</option>
            <option value="21–60 anos">21–60 anos</option>
            <option value="50+ anos">50+ anos</option>
          </select>
        </div>
      </div>

      {/* KPIs */}
      <div className="kpi-container">
        <div className="kpi-card">
          <div className="kpi-icon">
            <FiDollarSign />
          </div>
          <div className="kpi-content">
            <h3>Faturamento Total</h3>
            <p>{formatarMoeda(metricas.faturamento)}</p>
            <span className="kpi-trend positive">+12% em relação ao mês anterior</span>
          </div>
        </div>
        
        <div className="kpi-card">
          <div className="kpi-icon">
            <FiUsers />
          </div>
          <div className="kpi-content">
            <h3>Ingressos Vendidos</h3>
            <p>{metricas.ingressos}</p>
            <span className="kpi-trend positive">+8% em relação ao mês anterior</span>
          </div>
        </div>
        
        <div className="kpi-card">
          <div className="kpi-icon">
            <FiCalendar />
          </div>
          <div className="kpi-content">
            <h3>Eventos Realizados</h3>
            <p>{metricas.eventos}</p>
            <span className="kpi-trend neutral">igual ao mês anterior</span>
          </div>
        </div>
        
        <div className="kpi-card">
          <div className="kpi-icon">
            <FiPercent />
          </div>
          <div className="kpi-content">
            <h3>Margem de Lucro</h3>
            <p>{formatarPorcentagem(metricas.margem)}</p>
            <span className="kpi-trend positive">+2.5% em relação ao mês anterior</span>
          </div>
        </div>
        
        <div className="kpi-card">
          <div className="kpi-icon">
            <FiPieChart />
          </div>
          <div className="kpi-content">
            <h3>Ocupação Média</h3>
            <p>{formatarPorcentagem(metricas.ocupacaoMedia)}</p>
            <span className="kpi-trend negative">-3% em relação ao mês anterior</span>
          </div>
        </div>
      </div>

      {/* Gráficos */}
      <div className="ev-graficos-container">
        {/* Gráfico de Evolução Mensal */}
        <div className="grafico-card">
          <div className="grafico-header">
            <h3>Evolução Mensal</h3>
            <div className="grafico-legenda">
              <div className="legenda-item">
                <span className="legenda-color faturamento"></span>
                <span>Faturamento</span>
              </div>
              <div className="legenda-item">
                <span className="legenda-color lucro"></span>
                <span>Lucro</span>
              </div>
            </div>
          </div>
          <div className="grafico-wrapper">
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={dadosGraficos.evolucaoMensal}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="mes" stroke="#888" />
                <YAxis stroke="#888" />
                <Tooltip 
                  formatter={(value) => [formatarMoeda(value), 'Valor']}
                  contentStyle={{
                    background: '#fff',
                    border: 'none',
                    borderRadius: '8px',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                    padding: '10px'
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="faturamento" 
                  name="Faturamento" 
                  stroke="#0f8f8a" 
                  fill="#0f8f8a" 
                  fillOpacity={0.1} 
                />
                <Area 
                  type="monotone" 
                  dataKey="lucro" 
                  name="Lucro" 
                  stroke="#FF254A" 
                  fill="#FF254A" 
                  fillOpacity={0.1} 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Gráfico de Pizza por Segmento */}
        <div className="grafico-card">
          <div className="grafico-header">
            <h3>Distribuição por Segmento</h3>
          </div>
          <div className="grafico-wrapper">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={dadosGraficos.porSegmento}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {dadosGraficos.porSegmento.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => formatarMoeda(value)}
                  contentStyle={{
                    background: '#fff',
                    border: 'none',
                    borderRadius: '8px',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                    padding: '10px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Gráfico de Barras por Faixa Etária */}
        <div className="grafico-card">
          <div className="grafico-header">
            <h3>Faturamento por Faixa Etária</h3>
          </div>
          <div className="grafico-wrapper">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dadosGraficos.porFaixaEtaria}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" stroke="#888" />
                <YAxis stroke="#888" />
                <Tooltip 
                  formatter={(value) => formatarMoeda(value)}
                  contentStyle={{
                    background: '#fff',
                    border: 'none',
                    borderRadius: '8px',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                    padding: '10px'
                  }}
                />
                <Bar 
                  dataKey="value" 
                  name="Faturamento" 
                  fill="#0f8f8a"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Tabela de Top Eventos */}
        <div className="grafico-card">
          <div className="grafico-header">
            <h3>Top 5 Eventos</h3>
          </div>
          <div className="top-eventos-wrapper">
            <table className="tabela-top-eventos">
              <thead>
                <tr>
                  <th>Evento</th>
                  <th>Faturamento</th>
                  <th>Ocupação</th>
                </tr>
              </thead>
              <tbody>
                {dadosFiltrados
                  .sort((a, b) => b.valorTotal - a.valorTotal)
                  .slice(0, 5)
                  .map((evento, index) => (
                    <tr key={index}>
                      <td>{evento.tema}</td>
                      <td className="valor">{formatarMoeda(evento.valorTotal)}</td>
                      <td>
                        <div className="ocupacao-container">
                          <div className="ocupacao-bar">
                            <div 
                              className="ocupacao-fill" 
                              style={{ 
                                width: `${evento.ocupacao}%`,
                                backgroundColor: 
                                  evento.ocupacao > 70 ? '#0f8f8a' : 
                                  evento.ocupacao > 30 ? '#FFC107' : '#FF254A'
                              }}
                            ></div>
                          </div>
                          <span>{evento.ocupacao}%</span>
                        </div>
                      </td>
                    </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Tabela de Eventos */}
      <div className="tabela-container">
        <div className="tabela-header">
          <h3>Detalhes dos Eventos</h3>
          <span className="total-registros">
            Exibindo {dadosFiltrados.length} de {dadosUnificados.length} eventos
          </span>
        </div>
        
        <div className="tabela-wrapper">
          <table className="tabela-dados">
            <thead>
              <tr>
                <th>ID</th>
                <th>Evento</th>
                <th>Segmento</th>
                <th>Faixa Etária</th>
                <th>Data</th>
                <th>Ingressos</th>
                <th>Valor Unit.</th>
                <th>Faturamento</th>
                <th>Ocupação</th>
              </tr>
            </thead>
            <tbody>
              {dadosFiltrados.length > 0 ? (
                dadosFiltrados.map((evento) => (
                  <tr key={evento.id}>
                    <td>{evento.id}</td>
                    <td className="evento-nome">{evento.tema}</td>
                    <td>
                      <span className={`badge ${evento.segmento.toLowerCase().replace(' ', '-')}`}>
                        {evento.segmento}
                      </span>
                    </td>
                    <td>{evento.faixaEtaria}</td>
                    <td>{new Date(evento.data).toLocaleDateString()}</td>
                    <td>{evento.ingressosVendidos}</td>
                    <td>{formatarMoeda(evento.valorIngresso)}</td>
                    <td className="valor">{formatarMoeda(evento.valorTotal)}</td>
                    <td>
                      <div className="ocupacao-container">
                        <div className="ocupacao-bar">
                          <div 
                            className="ocupacao-fill" 
                            style={{ 
                              width: `${evento.ocupacao}%`,
                              backgroundColor: 
                                evento.ocupacao > 70 ? '#0f8f8a' : 
                                evento.ocupacao > 30 ? '#FFC107' : '#FF254A'
                            }}
                          ></div>
                        </div>
                        <span>{evento.ocupacao}%</span>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="sem-dados">
                    Nenhum evento encontrado com os filtros atuais
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