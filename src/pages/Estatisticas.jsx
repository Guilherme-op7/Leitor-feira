import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { MapPin, QrCode, BarChart3, Home, Trash2, Users } from "lucide-react";
import '../styles/main.scss';
import '../styles/estatisticas.scss';

export function EstatisticasPage() {
  const [stats, setStats] = useState([]);
  const [erro, setErro] = useState("");

  useEffect(() => {
    async function carregarEstatisticas() {
      try {
        const res = await axios.get("https://backend-leitor-feira.onrender.com/estatisticas");
        setStats(res.data);
      } 
      
      catch (err) {
        console.error("Erro ao carregar estatísticas:", err);
        setErro("Erro ao carregar estatísticas");
      }
    }
    carregarEstatisticas();
  }, []);

  const Limpar = async () => {
    try {
      await axios.delete("https://backend-leitor-feira.onrender.com/estatisticas");
      setStats([]);
    } 
    
    catch (err) {
      console.error("Erro ao limpar dados:", err);
      setErro("Erro ao limpar dados");
    }
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

            <div className="cabeca-links">
              <Link to="/" className="cabeca-link">
                <Home className="cabeca-icone" />
                <span className="cabeca-texto">Início</span>
              </Link>
              <Link to="/scanner" className="cabeca-link">
                <QrCode className="cabeca-icone" />
                <span className="cabeca-texto">Scanner QR</span>
              </Link>
              <Link to="/estatisticas" className="cabeca-link ativo">
                <BarChart3 className="cabeca-icone" />
                <span className="cabeca-texto">Estatísticas</span>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="corpo-container">
        <div className="corpo-cabecalho">
          <h1 className="corpo-titulo">Estatísticas por Local</h1>
          <p className="corpo-desc">Visão detalhada das visitas registradas por local</p>
        </div>

        {erro && <p className="alerta alerta-perigo">{erro}</p>}

        <div className="stats-layout">
          {stats.length === 0 ? (
            <p>Nenhuma visita registrada.</p>
          ) : (
            stats.map((item) => (
              <div key={item.local} className="caixa stats-caixa stats-primario">
                <div className="caixa-cabecalho">
                  <div className="caixa-titulo">
                    <MapPin className="caixa-icone" />
                    {item.local}
                  </div>
                </div>
                <div className="caixa-conteudo">
                  <div className="numero numero-primario">{item.total_visitas}</div>
                  <div className="texto-pequeno">Total de visitas</div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="acoes">
          <button className="botao botao-perigo" onClick={Limpar}>
            <Trash2 className="botao-icone" />
            Limpar Dados
          </button>
        </div>
      </div>
    </section>
  );
}
