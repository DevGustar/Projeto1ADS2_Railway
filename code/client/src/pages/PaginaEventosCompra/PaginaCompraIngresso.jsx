import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Header } from "../../components/Header/Header";
import "./styles-compra.css";

export const PaginaCompraIngresso = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { evento } = location.state || {};
  
  // Estados para controle da compra
  const [quantidade, setQuantidade] = useState(1);
  const [sessaoSelecionada, setSessaoSelecionada] = useState(evento?.horarios[0] || '');
  const [tipoIngresso, setTipoIngresso] = useState('Inteira');
  const [meiaEntrada, setMeiaEntrada] = useState(false);
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [cpf, setCpf] = useState('');
  const [pagamento, setPagamento] = useState('credito');
  const [parcelas, setParcelas] = useState(1);
  const [aceiteTermos, setAceiteTermos] = useState(false);

  // Preços
  const precoBase = 50; // Valor base do ingresso
  const precoMeia = precoBase * 0.5;
  
  // Calcular valor total
  const calcularTotal = () => {
    const valorUnitario = tipoIngresso === 'Inteira' ? precoBase : precoMeia;
    return (valorUnitario * quantidade).toFixed(2);
  };

  // Formatadores
  const formatarData = (dataStr) => {
    const [dia, mes, ano] = dataStr.split('/');
    return `${dia}/${mes} - ${ano}`;
  };

  // Manipuladores de eventos
  const handleComprar = (e) => {
    e.preventDefault();
    if (!aceiteTermos) {
      alert('Você precisa aceitar os termos e condições para continuar');
      return;
    }
    
    // Simulação de processamento de pagamento
    alert(`Compra realizada com sucesso!\n\n${quantidade} ingresso(s) para ${evento.titulo}\nTotal: R$ ${calcularTotal()}`);
    navigate('/');
  };

  const handleVoltar = () => {
    navigate(-1);
  };

  if (!evento) {
    return (
      <div className="cinemark-theme">
        <Header />
        <div className="ev-container error-message">
          <h2>Evento não encontrado</h2>
          <p>Volte à página de eventos e selecione novamente.</p>
          <button onClick={handleVoltar} className="back-button">Voltar</button>
        </div>
      </div>
    );
  }

  return (
    <div className="cinemark-theme">
      <Header />
      
      <div className="ev-container compra-container">
        {/* Breadcrumb */}
        <div className="breadcrumb">
          <span onClick={handleVoltar}>Eventos</span> &gt; <span>{evento.titulo}</span>
        </div>
        
        <div className="compra-content">
          {/* Detalhes do Evento */}
          <div className="event-details">
            <div className="event-poster-large">
              <img src={evento.imagem} alt={evento.titulo} />
              <span className={`age-rating age-${evento.classificacao}`}>
                {evento.classificacao}
              </span>
            </div>
            
            <div className="event-info">
              <h1>{evento.titulo}</h1>
              <div className="event-meta">
                <span className="genre">{evento.genero}</span>
                <span className="duration">{evento.duracao}</span>
              </div>
              
              <div className="info-row">
                <span className="info-label">Data:</span>
                <span className="info-value">{formatarData(evento.data)}</span>
              </div>
              
              <div className="info-row">
                <span className="info-label">Local:</span>
                <span className="info-value">Centro de Convenções - Sala 3</span>
              </div>
              
              <div className="info-row">
                <span className="info-label">Endereço:</span>
                <span className="info-value">Av. Paulista, 1000 - São Paulo/SP</span>
              </div>
              
              <p className="event-description">{evento.descricao}</p>
            </div>
          </div>
          
          {/* Formulário de Compra */}
          <form className="purchase-form" onSubmit={handleComprar}>
            <h2>Selecione sua sessão</h2>
            <div className="form-group">
              <label>Horário:</label>
              <div className="time-selector">
                {evento.horarios.map((time, i) => (
                  <button
                    key={i}
                    type="button"
                    className={`time-option ${sessaoSelecionada === time ? 'selected' : ''}`}
                    onClick={() => setSessaoSelecionada(time)}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="form-group">
              <label>Quantidade de ingressos:</label>
              <div className="quantity-selector">
                <button 
                  type="button" 
                  className="quantity-btn"
                  onClick={() => setQuantidade(Math.max(1, quantidade - 1))}
                  disabled={quantidade <= 1}
                >
                  -
                </button>
                <span className="quantity-value">{quantidade}</span>
                <button 
                  type="button" 
                  className="quantity-btn"
                  onClick={() => setQuantidade(quantidade + 1)}
                >
                  +
                </button>
              </div>
            </div>
            
            <div className="form-group">
              <label>Tipo de ingresso:</label>
              <div className="ticket-type-selector">
                <label className="ticket-option">
                  <input
                    type="radio"
                    name="tipoIngresso"
                    checked={tipoIngresso === 'Inteira'}
                    onChange={() => setTipoIngresso('Inteira')}
                  />
                  <span>Inteira - R$ {precoBase.toFixed(2)}</span>
                </label>
                
                <label className="ticket-option">
                  <input
                    type="radio"
                    name="tipoIngresso"
                    checked={tipoIngresso === 'Meia'}
                    onChange={() => setTipoIngresso('Meia')}
                  />
                  <span>Meia - R$ {precoMeia.toFixed(2)}</span>
                </label>
                
                <div className="meia-entrada-info">
                  <label>
                    <input
                      type="checkbox"
                      checked={meiaEntrada}
                      onChange={(e) => setMeiaEntrada(e.target.checked)}
                    />
                    <span>Declaro que possuo direito à meia-entrada</span>
                  </label>
                  <small>(Estudante, Idoso, PCD ou outros conforme lei)</small>
                </div>
              </div>
            </div>
            
            <div className="form-group">
              <label>Dados Pessoais</label>
              <input
                type="text"
                placeholder="Nome completo"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                required
              />
              <input
                type="email"
                placeholder="E-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <input
                type="text"
                placeholder="CPF"
                value={cpf}
                onChange={(e) => setCpf(e.target.value)}
                required
              />
            </div>
            
            <div className="form-group">
              <label>Forma de Pagamento</label>
              <div className="payment-methods">
                <label className="payment-option">
                  <input
                    type="radio"
                    name="pagamento"
                    value="credito"
                    checked={pagamento === 'credito'}
                    onChange={() => setPagamento('credito')}
                  />
                  <span>Cartão de Crédito</span>
                </label>
                
                <label className="payment-option">
                  <input
                    type="radio"
                    name="pagamento"
                    value="debito"
                    checked={pagamento === 'debito'}
                    onChange={() => setPagamento('debito')}
                  />
                  <span>Cartão de Débito</span>
                </label>
                
                <label className="payment-option">
                  <input
                    type="radio"
                    name="pagamento"
                    value="pix"
                    checked={pagamento === 'pix'}
                    onChange={() => setPagamento('pix')}
                  />
                  <span>PIX</span>
                </label>
              </div>
              
              {pagamento === 'credito' && (
                <div className="credit-card-details">
                  <input type="text" placeholder="Número do Cartão" required />
                  <input type="text" placeholder="Nome no Cartão" required />
                  <div className="card-row">
                    <input type="text" placeholder="Validade (MM/AA)" required />
                    <input type="text" placeholder="CVV" required />
                  </div>
                  
                  <div className="installments">
                    <label>Parcelas:</label>
                    <select value={parcelas} onChange={(e) => setParcelas(parseInt(e.target.value))}>
                      {[1, 2, 3, 4, 5, 6].map((num) => (
                        <option key={num} value={num}>
                          {num}x de R$ {(calcularTotal() / num).toFixed(2)} {num > 1 ? '(sem juros)' : ''}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}
              
              {pagamento === 'pix' && (
                <div className="pix-info">
                  <p>Você receberá um QR Code para pagamento após finalizar a compra.</p>
                  <p>O ingresso será liberado após confirmação do pagamento.</p>
                </div>
              )}
            </div>
            
            <div className="terms-section">
              <label>
                <input
                  type="checkbox"
                  checked={aceiteTermos}
                  onChange={(e) => setAceiteTermos(e.target.checked)}
                  required
                />
                <span>Li e aceito os <a href="#" target="_blank">Termos de Uso</a> e <a href="#" target="_blank">Política de Privacidade</a></span>
              </label>
            </div>
            
            <div className="total-section">
              <div className="total-row">
                <span>Subtotal:</span>
                <span>R$ {calcularTotal()}</span>
              </div>
              <div className="total-row">
                <span>Taxa de serviço:</span>
                <span>R$ 2,50</span>
              </div>
              <div className="total-row final-total">
                <span>Total:</span>
                <span>R$ {(parseFloat(calcularTotal()) + 2.5).toFixed(2)}</span>
              </div>
            </div>
            
            <div className="action-buttons">
              <button type="button" className="back-button" onClick={handleVoltar}>Voltar</button>
              <button type="submit" className="confirm-button">Finalizar Compra</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};