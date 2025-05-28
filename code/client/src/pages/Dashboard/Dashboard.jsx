import "./Dashboard.css";
import React, { useState } from 'react';

// Importa os gráficos de belezuras
import PolarAreaCharts from "../../features/PolarAreaCharts/PolarAreaCharts";
import BarChart from "../../features/BarChart/BarChart";
import RealTimeChart from "../../features/RealTimeChart/RealTimeChart";




// Componentes reutilizáveis
import Card from "../../components/Card/Card";
import ValorTipoEvento from "../../components/Card/CardValores";
import TotalEventosCard from "../../components/Card/TotalEventos";





const Dashboard = () => {
  const [participantes, setParticipantes] = useState([]);

  const adicionarParticipante = (novo) => {
    setParticipantes((prev) => [...prev, novo]);
  };

  return (
    <div className="container">
      <div className="conteudo">

        <div className="miniretangulo">
          <Card title="Participantes" value="150" />
          <TotalEventosCard />
          <Card title="Organizadores" value="37" />
          <Card title="Inscrições" value="89" />
        </div>

        {/* <div className="form-section">
          <h3>Adicionar Participante</h3>
        </div>*/}

        <div className="participantes">
          <table>
            <thead>
              <tr>
                <th>Nome</th>
                <th>Cargo</th>
              </tr>
            </thead>
            <tbody>
              {participantes.map((p, i) => (
                <tr key={i}>
                  <td>{p.nome}</td>
                  <td>{p.cargo}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="ContainerVertical">
          <div className="Grafico">
          </div>

          <div className="GraficoJunto">
            <div className="EspaçoJunto"><PolarAreaCharts /></div>
            <div className="EspaçoJunto"><BarChart /></div>
            <div className="EspaçoJunto"><RealTimeChart /></div>
          </div>
        </div>

        <div className="miniretangulo">


          <div className="miniretangulo">
            <ValorTipoEvento tipo="palestra" />
            <ValorTipoEvento tipo="doacao" />
            <ValorTipoEvento tipo="terapia" />
          </div>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;
export { Dashboard };
