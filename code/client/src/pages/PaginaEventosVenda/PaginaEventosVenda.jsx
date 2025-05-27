import React from 'react';
import { Header } from "../../components/Header/Header";
import Banner1 from "./img/Banner1.png";
import Banner2 from "./img/Banner2.png";
import Panfleto1 from "./img/Panfleto1.png";
import Panfleto2 from "./img/Panfleto2.png";
import Panfleto3 from "./img/Panfleto3.png";
import Panfleto4 from "./img/Panfleto4.png";
import Panfleto5 from "./img/Panfleto5.png";

import "./styles.css";

// Dados dos eventos
const eventos = [
  {
    id: "banner-inicio",
    tipo: "banner",
    imagem: Banner1,
    alt: "Evento em Destaque",
    link: "#"
  },
  ...Array.from({ length: 12 }, (_, i) => ({
    id: i + 1,
    tipo: "evento",
    titulo: [`Workshop de Entrevistas`, `Técnicas de Entrevista`, `Feira de Ciências`, `Mentoria para Jovens `, `Oficina de Meditação`, `Workshop de Comunicação`][i % 6],
    descricao: [`Evento sobre "Networking Estratégico`, `Entrevistas de Emprego: Dicas e Simulações`, `Matemática Divertida: Jogos e Desafios`,`Aventuras em Ciências: Experimentos Interativos`,`Meditação Guiada para Iniciantes ao ar livre`, `Comunicação Profissional para Jovens`][i % 6],
    imagem: [Panfleto1, Panfleto2, Panfleto3, Panfleto4, Panfleto5, Panfleto1, Panfleto2, Panfleto3, Panfleto4, Panfleto5,  Panfleto2, Panfleto1, Panfleto2, Panfleto3, Panfleto4, Panfleto5][i + 1],
    classificacao: ["L", "10", "12", "14", "16", "18"][i % 6],
    data: `0${(i % 9) + 1}/06/2025`,
    horarios: ["10:00", "13:30", "16:00", "19:00", "22:00"].slice(0, (i % 3) + 1),
    genero: ["Recolocação", "Primeiro Emprego", "Aprendizado", "Aprendizado", "Bem-Estar", "Recolocação"][i % 6],
    duracao: `${90 + (i * 10)} min`
  })),
  {
    id: "banner-final",
    tipo: "banner",
    imagem: Banner2,
    alt: "Promoções Exclusivas",
    link: "#"
  }
];

export const PaginaEventosVenda = () => {
  return (
    <div className="cinemark-theme">
      <Header />
      
      {/* Banner Principal */}
      <section className="main-banner">
        <a href={eventos[0].link}>
          <img src={eventos[0].imagem} alt={eventos[0].alt} />
        </a>
      </section>
      
      <div className="ev-container">
        {/* Filtros */}
        <div className="ev-filters">
          <h2>Eventos</h2>
          <div className="ev-filter-options">
            <select>
              <option>Cidade: Todas</option>
              <option>São Paulo</option>
              <option>Rio de Janeiro</option>
              <option>Belo Horizonte</option>
            </select>
            <select>
              <option>Data: Todas</option>
              <option>Hoje</option>
              <option>Amanhã</option>
              <option>Este fim de semana</option>
            </select>
            <select>
              <option>Tipo: Todos</option>
              <option>Shows</option>
              <option>Teatro</option>
              <option>Esportes</option>
            </select>
          </div>
        </div>
        
        {/* Grade de Eventos */}
        <div className="events-grid">
          {eventos.slice(1, -1).map((evento) => (
            <div key={evento.id} className="event-card">
              <div className="event-poster">
                <img src={evento.imagem} alt={evento.titulo} />
                <span className={`age-rating age-${evento.classificacao}`}>
                  {evento.classificacao}
                </span>
              </div>
              <div className="event-info">
                <h3>{evento.titulo}</h3>
                <div className="event-meta">
                  <span className="genre">{evento.genero}</span>
                  <span className="duration">{evento.duracao}</span>
                </div>
                <p className="ev-description">{evento.descricao}</p>
                <div className="ev-sessions">
                  <strong>Sessões:</strong>
                  <div className="times">
                    {evento.horarios.map((time, i) => (
                      <a key={i} href="#" className="time-slot">{time}</a>
                    ))}
                  </div>
                </div>
                <a href="#" className="buy-button">Comprar</a>
              </div>
            </div>
          ))}
        </div>
        
        {/* Banner Promocional */}
        <section className="promo-banner">
          <a href={eventos[eventos.length-1].link}>
            <img src={eventos[eventos.length-1].imagem} alt={eventos[eventos.length-1].alt} />
          </a>
        </section>
      </div>
    </div>
  );
};