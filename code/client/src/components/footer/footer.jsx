import React from "react";
import "./footer.css";

export const Footer = () => {
  return (
    <footer className="footer-compact">
      <div className="footer-content">
        <div className="footer-left">
          <span className="footer-logo">Instituto Criativo</span>
          <span className="footer-copyright">
            &copy; {new Date().getFullYear()} Todos os direitos reservados
          </span>
        </div>
        
        <div className="footer-right">
          <div className="footer-links">
            <a href="/privacidade">Privacidade</a>
            <a href="/termos">Termos</a>
            <a href="/contato">Contato</a>
          </div>
          
          <div className="footer-social">
            <a href="#" aria-label="Instagram"><i className="fab fa-instagram"></i></a>
            <a href="#" aria-label="LinkedIn"><i className="fab fa-linkedin-in"></i></a>
          </div>
        </div>
      </div>
    </footer>
  );
};