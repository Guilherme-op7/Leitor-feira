import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { MapPin, QrCode, BarChart3, Home, Trash2, Users } from "lucide-react";
import '../styles/main.scss';
import '../styles/estatisticas.scss';

export function EstatisticasPage() {
  const [stats, setStats] = useState({
    total: 0,
    locations: 0
  });

  useEffect(() => {
          async function carregarEstatisticas() {
        try {
          const res = await axios.get("https://leitor-feira-1.onrender.com/estatisticas");
          setStats(res.data);
        } catch (err) {
          console.error("Erro ao carregar estatísticas:", err);
        }
      }
    carregarEstatisticas();
  }, []);

  const Limpar = async () => {
    try {
      await axios.delete("https://leitor-feira-1.onrender.com/visitas");
      setStats({ total: 0, locations: 0 });
    } catch (err) {
      console.error("Erro ao limpar dados:", err);
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
          <h1 className="corpo-titulo">Estatísticas</h1>
          <p className="corpo-desc">Visão geral das visitas registradas</p>
        </div>

        <div className="stats-layout">
          <div className="caixa stats-caixa stats-primario">
            <div className="caixa-cabecalho">
              <div className="caixa-titulo">Total de Visitas</div>
              <Users className="caixa-icone" />
            </div>
            <div className="caixa-conteudo">
              <div className="numero numero-primario">{stats.total}</div>
              <div className="texto-pequeno">Todas as visitas registradas</div>
            </div>
          </div>

          <div className="caixa stats-caixa stats-sucesso">
            <div className="caixa-cabecalho">
              <div className="caixa-titulo">Locais Ativos</div>
              <MapPin className="caixa-icone" />
            </div>
            <div className="caixa-conteudo">
              <div className="numero numero-sucesso">{stats.locations}</div>
              <div className="texto-pequeno">Locais com visitas</div>
            </div>
          </div>
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
