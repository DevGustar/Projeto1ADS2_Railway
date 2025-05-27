import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ResumoVendasAdmin from './ResumoVendasAdmin.jsx';
import ResumoVendasMensal from './ResumoVendasMensal.jsx';
import documento from './img/documento.gif';
import grafico from './img/grafico-de-linha.gif';
import homeIcon from './img/globe.png';
import aboutIcon from './img/network.png';
import segmentIcon from './img/contract.png';
import usersIcon from './img/command.png';
import socialImpactIcon from './img/education.png';
import brandsIcon from './img/contract.png';
import dashboardIcon from './img/budget.png';
import "./PaginaEventos.css";

export const PaginaEventos = () => {
  const [resumoSelecionado, setResumoSelecionado] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  if (resumoSelecionado === 'geral') {
    return <ResumoVendasAdmin onVoltar={() => setResumoSelecionado(null)} />;
  }

  if (resumoSelecionado === 'mensal') {
    return <ResumoVendasMensal onVoltar={() => setResumoSelecionado(null)} />;
  }

  return (
    <div className={`pe-container ${menuOpen ? 'pe-container--menu-open' : ''}`}>
      <header className="pe-header">
        <button
          className="pe-header__menu-toggle"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle sidebar"
        >
          <span className="pe-header__menu-icon">☰</span>
        </button>
        <div className="pe-header__content">
          <h2 className="pe-header__title">Gerenciamento de Vendas</h2>
          <div className="pe-header__user-profile">
            <span className="pe-header__user-name">Admin</span>
            <div className="pe-header__user-avatar"></div>
          </div>
        </div>
      </header>

      <aside className={`pe-sidebar ${menuOpen ? 'pe-sidebar--open' : 'pe-sidebar--collapsed'}`}>
        <div className="pe-sidebar__header">
          {menuOpen && <h3 className="pe-sidebar__title">Menu</h3>}
        </div>
        <nav className="pe-sidebar__nav">
          <Link to="/homepage" onClick={() => setMenuOpen(false)} className="pe-sidebar__nav-item">
            <img src={homeIcon} alt="Home" className="pe-sidebar__icon" />
            {menuOpen && <span className="pe-sidebar__nav-text">Home</span>}
          </Link>
          <Link to="/sobre" onClick={() => setMenuOpen(false)} className="pe-sidebar__nav-item">
            <img src={aboutIcon} alt="Sobre" className="pe-sidebar__icon" />
            {menuOpen && <span className="pe-sidebar__nav-text">Sobre</span>}
          </Link>
          <Link to="/segmento" onClick={() => setMenuOpen(false)} className="pe-sidebar__nav-item">
            <img src={segmentIcon} alt="Segmentos" className="pe-sidebar__icon" />
            {menuOpen && <span className="pe-sidebar__nav-text">Segmentos</span>}
          </Link>
          <Link to="/colaboradores" onClick={() => setMenuOpen(false)} className="pe-sidebar__nav-item">
            <img src={usersIcon} alt="Colaboradores" className="pe-sidebar__icon" />
            {menuOpen && <span className="pe-sidebar__nav-text">Colaboradores</span>}
          </Link>
          <Link to="/impacto-social" onClick={() => setMenuOpen(false)} className="pe-sidebar__nav-item">
            <img src={socialImpactIcon} alt="Impacto Social" className="pe-sidebar__icon" />
            {menuOpen && <span className="pe-sidebar__nav-text">Impacto Social</span>}
          </Link>
          <Link to="/marcas" onClick={() => setMenuOpen(false)} className="pe-sidebar__nav-item">
            <img src={brandsIcon} alt="Marcas" className="pe-sidebar__icon" />
            {menuOpen && <span className="pe-sidebar__nav-text">Marcas</span>}
          </Link>
          <Link to="/dashboard" onClick={() => setMenuOpen(false)} className="pe-sidebar__nav-item">
            <img src={dashboardIcon} alt="Dashboard" className="pe-sidebar__icon" />
            {menuOpen && <span className="pe-sidebar__nav-text">Dashboard</span>}
          </Link>
        </nav>
      </aside>

      <main className="pe-main-content">
        <div className="pe-dashboard-header">
          <h2 className="pe-dashboard-title">Relatórios de Vendas</h2>
          <p className="pe-dashboard-subtitle">Acompanhe o desempenho das vendas</p>
        </div>
        
        <div className="pe-dashboard-cards">
          <div className="pe-card" onClick={() => setResumoSelecionado('geral')}>
            <div className="pe-card__icon-container">
              <img src={documento} className="pe-card__icon" alt="ícone geral" />
            </div>
            <div className="pe-card__content">
              <h3 className="pe-card__title">Histórico Geral</h3>
              <p className="pe-card__description">Visualize as vendas totais por evento dos últimos 12 meses com detalhes completos.</p>
            </div>
            <div className="pe-card__badge">Novo</div>
          </div>

          <div className="pe-card" onClick={() => setResumoSelecionado('mensal')}>
            <div className="pe-card__icon-container">
              <img src={grafico} className="pe-card__icon" alt="ícone mensal" />
            </div>
            <div className="pe-card__content">
              <h3 className="pe-card__title">Relatório Mensal</h3>
              <p className="pe-card__description">Visualize as vendas agrupadas por mês de cada segmento emitidas nos últimos 12 meses.</p>
            </div>
          </div>
        </div>
        
        <div className="pe-dashboard-footer">
          <p className="pe-instruction">Selecione uma das opções acima para visualizar os relatórios detalhados</p>
        </div>
      </main>
    </div>
  );
};