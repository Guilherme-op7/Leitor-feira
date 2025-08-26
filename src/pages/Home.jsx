import { Link } from "react-router-dom";
import { QrCode, BarChart3, ArrowRight, Home } from "lucide-react";
import '../styles/main.scss';

export function HomePage() {
  return (
    <section id="home-page">
      <nav className="cabeca">
        <div className="cabeca-container">
          <div className="cabeca-conteudo">
            <div className="cabeca-marca">
              <QrCode className="cabeca-logo" />
              <span className="cabeca-titulo">Leitor QRFrei</span>
            </div>

            <div className="cabeca-links">
              <Link to="/" className="cabeca-link ativo">
                <Home className="cabeca-icone" />
                <span className="cabeca-texto">Início</span>
              </Link>
              <Link to="/scanner" className="cabeca-link">
                <QrCode className="cabeca-icone" />
                <span className="cabeca-texto">Scanner QR</span>
              </Link>
              <Link to="/estatisticas" className="cabeca-link">
                <BarChart3 className="cabeca-icone" />
                <span className="cabeca-texto">Estatísticas</span>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="gremio">
        <div className="gremio-container">
          <div className="gremio-conteudo">
            <div className="gremio-icone">
              <QrCode className="gremio-icone-svg" />
            </div>

            <div>
              <h1 className="gremio-titulo">Leitor QRFrei</h1>
              <p className="gremio-descricao">
                Sistema inteligente para rastrear a movimentação de pessoas em diferentes locais
              </p>
            </div>

            <div className="gremio-botoes">
              <Link to="/scanner" className="botao botao-branco">
                <QrCode className="botao-icone" />
                <span>Iniciar Scanner</span>
                <ArrowRight className="botao-icone" />
              </Link>

              <Link to="/estatisticas" className="botao botao-transparente">
                <BarChart3 className="botao-icone" />
                <span>Ver Estatísticas</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
