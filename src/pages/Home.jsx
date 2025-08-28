import { Link } from "react-router-dom";
import { QrCode, BarChart3, LogIn, ArrowRight } from "lucide-react";
import "../styles/main.scss";

export function Home() {
  const token = localStorage.getItem("token");
  const usuario = localStorage.getItem("usuario");

  const fazerLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    window.location.reload();
  };

  return (
    <section className="corpo ativo">
      <nav className="cabeca">
        <div className="cabeca-container">
          <div className="cabeca-conteudo">
            <div className="cabeca-marca">
              <QrCode className="cabeca-logo" />
              <span className="cabeca-titulo">Leitor QRFrei</span>
            </div>
            <div className="cabeca-acoes">
              {token && usuario ? (
                <div className="usuario-logado">
                  <span>Olá, {JSON.parse(usuario).nome || "Usuário"}</span>
                  <button onClick={fazerLogout} className="botao botao-contorno">
                    Sair
                  </button>
                </div>
              ) : (
                <Link to="/login" className="botao botao-primario">
                  <LogIn className="botao-icone" />
                  Entrar
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      <div className="corpo-container">
        <div className="corpo-cabecalho">
          <h1 className="corpo-titulo">Sistema de Leitor QR</h1>
          <p className="corpo-desc">
            Registre a passagem de pessoas pelos locais usando códigos QR
          </p>
        </div>

        <div className="home-layout">
          <div className="caixa home-caixa">
            <div className="caixa-cabecalho">
              <div className="caixa-titulo">
                <QrCode className="caixa-titulo-icone" />
                <span>Scanner QR</span>
              </div>
            </div>
            <div className="caixa-conteudo">
              <p>Use o scanner para ler códigos QR e registrar visitas nos locais.</p>
              {token ? (
                <Link to="/scanner" className="botao botao-primario">
                  <QrCode className="botao-icone" />
                  <span>Acessar Scanner</span>
                  <ArrowRight className="botao-icone" />
                </Link>
              ) : (
                <Link to="/login" className="botao botao-primario">
                  <LogIn className="botao-icone" />
                  <span>Fazer Login</span>
                  <ArrowRight className="botao-icone" />
                </Link>
              )}
            </div>
          </div>

          <div className="caixa home-caixa">
            <div className="caixa-cabecalho">
              <div className="caixa-titulo">
                <BarChart3 className="caixa-titulo-icone" />
                <span>Estatísticas</span>
              </div>
            </div>
            <div className="caixa-conteudo">
              <p>Visualize estatísticas completas das visitas registradas no sistema.</p>
              {token && usuario ? (
                JSON.parse(usuario).isAdmin ? (
                  <Link to="/estatisticas" className="botao botao-primario">
                    <BarChart3 className="botao-icone" />
                    <span>Ver Estatísticas</span>
                    <ArrowRight className="botao-icone" />
                  </Link>
                ) : (
                  <div className="acesso-negado">
                    <p className="texto-pequeno">Apenas administradores podem acessar estatísticas completas.</p>
                  </div>
                )
              ) : (
                <Link to="/login" className="botao botao-primario">
                  <LogIn className="botao-icone" />
                  <span>Fazer Login</span>
                  <ArrowRight className="botao-icone" />
                </Link>
              )}
            </div>
          </div>
        </div>

        <div className="home-info">
          <h3>Como funciona?</h3>
          <div className="passos">
            <div className="passo">
              <div className="passo-numero">1</div>
              <p>Faça login no sistema</p>
            </div>
            <div className="passo">
              <div className="passo-numero">2</div>
              <p>Selecione a sala onde está</p>
            </div>
            <div className="passo">
              <div className="passo-numero">3</div>
              <p>Use o scanner para ler QR Codes</p>
            </div>
            <div className="passo">
              <div className="passo-numero">4</div>
              <p>Confirme a leitura para registrar</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
