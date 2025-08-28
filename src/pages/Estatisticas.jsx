import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { estatisticasMock } from "../config/users";
import { BarChart3, LogOut, Filter, Download, Calendar, MapPin, QrCode, Clock, Home } from "lucide-react";
import "../styles/main.scss";
import "../styles/estatisticas.scss";

export function EstatisticasPage() {
  const [usuario, setUsuario] = useState(null);
  const [estatisticas, setEstatisticas] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [filtroAndar, setFiltroAndar] = useState("");
  const [filtroSala, setFiltroSala] = useState("");
  const [filtroData, setFiltroData] = useState("");
  const navigate = useNavigate();

  const andares = ["Patio", "Primeiro Andar", "Segundo Andar", "Terceiro Andar"];
  const salas = {
    "Patio": ["Sala 1", "Sala 2", "Sala 3", "Sala 4"],
    "Primeiro Andar": ["Sala 21", "Sala 22", "Sala 23", "Sala 24"],
    "Segundo Andar": ["Lab Informática 1", "Lab Informática 2", "Lab 26", "Lab 27"],
    "Terceiro Andar": ["Sala 28", "Sala 33"],
  };

  useEffect(() => {
    verificarAutenticacao();
  }, []);

  const verificarAutenticacao = () => {
    const token = localStorage.getItem("token");
    const usuarioSalvo = localStorage.getItem("usuario");

    if (!token || !usuarioSalvo) {
      navigate("/login");
      return;
    }

    try {
      const usuarioObj = JSON.parse(usuarioSalvo);
      if (!usuarioObj.isAdmin) {
        setErro("Acesso negado. Apenas administradores podem ver estatísticas completas.");
        setCarregando(false);
        return;
      }
      setUsuario(usuarioObj);
      carregarEstatisticas();
    } catch (err) {
      console.error("Erro ao verificar usuário:", err);
      navigate("/login");
    }
  };

  const carregarEstatisticas = async () => {
    try {
      setCarregando(true);

      setTimeout(() => {

        setEstatisticas([...estatisticasMock]);
        setErro("");
        setCarregando(false);
      }, 1000);

    } catch (err) {
      setErro("Erro ao carregar estatísticas");
      console.error("Erro:", err);
      setCarregando(false);
    }
  };

  const fazerLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    navigate("/login");
  };

  const filtrarEstatisticas = () => {
    let filtradas = [...estatisticas];

    if (filtroAndar) {
      filtradas = filtradas.filter(item => item.andar === filtroAndar);
    }

    if (filtroSala) {
      filtradas = filtradas.filter(item => item.sala === filtroSala);
    }

    if (filtroData) {
      const dataFiltro = new Date(filtroData);
      filtradas = filtradas.filter(item => {
        const dataItem = new Date(item.data);
        return dataItem.toDateString() === dataFiltro.toDateString();
      });
    }

    return filtradas;
  };

  const exportarCSV = () => {
    const dadosFiltrados = filtrarEstatisticas();
    const csvContent = [
      "Data/Hora,Andar,Sala,Código QR",
      ...dadosFiltrados.map(item => 
        `${item.data},${item.andar},${item.sala},${item.codigo}`
      )
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `estatisticas_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const limparFiltros = () => {
    setFiltroAndar("");
    setFiltroSala("");
    setFiltroData("");
  };

  if (carregando) {
    return (
      <div className="corpo ativo">
        <div className="corpo-container">
          <div className="carregando">
            <BarChart3 className="carregando-icone" />
            <p>Carregando estatísticas...</p>
          </div>
        </div>
      </div>
    );
  }

  if (erro && !usuario) {
    return (
      <div className="corpo ativo">
        <div className="corpo-container">
          <div className="erro-acesso">
            <h2>Acesso Negado</h2>
            <p>{erro}</p>
            <button onClick={() => navigate("/scanner")} className="botao botao-primario">
              Voltar ao Scanner
            </button>
          </div>
        </div>
      </div>
    );
  }

  const estatisticasFiltradas = filtrarEstatisticas();

  return (
    <section className="corpo ativo">
      <nav className="cabeca">
        <div className="cabeca-container">
          <div className="cabeca-conteudo">
            <div className="cabeca-marca">
              <BarChart3 className="cabeca-logo" />
              <span className="cabeca-titulo">Estatísticas - Admin</span>
            </div>
            <div className="cabeca-usuario">
              <span>Olá, {usuario?.nome || "Admin"}</span>
              <button onClick={fazerLogout} className="botao-logout">
                <LogOut className="botao-icone" />
                Sair
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="corpo-container">
        <div className="corpo-cabecalho">
          <h1 className="corpo-titulo">Estatísticas Completas</h1>
          <p className="corpo-desc">Visualize todas as leituras de QR Code registradas no sistema</p>
        </div>

        <div className="filtros-container">
          <div className="filtros-header">
            <Filter className="filtros-icone" />
            <h3>Filtros</h3>
          </div>
          
          <div className="filtros-grid">
            <div className="filtro-grupo">
              <label>Andar:</label>
              <select
                value={filtroAndar}
                onChange={(e) => setFiltroAndar(e.target.value)}
                className="filtro-select"
              >
                <option value="">Todos os andares</option>
                {andares.map(andar => (
                  <option key={andar} value={andar}>{andar}</option>
                ))}
              </select>
            </div>

            <div className="filtro-grupo">
              <label>Sala:</label>
              <select
                value={filtroSala}
                onChange={(e) => setFiltroSala(e.target.value)}
                className="filtro-select"
                disabled={!filtroAndar}
              >
                <option value="">Todas as salas</option>
                {filtroAndar && salas[filtroAndar]?.map(sala => (
                  <option key={sala} value={sala}>{sala}</option>
                ))}
              </select>
            </div>

            <div className="filtro-grupo">
              <label>Data:</label>
              <input
                type="date"
                value={filtroData}
                onChange={(e) => setFiltroData(e.target.value)}
                className="filtro-input"
              />
            </div>

            <div className="filtros-acoes">
              <button onClick={limparFiltros} className="botao botao-contorno">
                Limpar Filtros
              </button>
              <button onClick={exportarCSV} className="botao botao-primario">
                <Download className="botao-icone" />
                Exportar CSV
              </button>
            </div>
          </div>
        </div>

        <div className="estatisticas-resumo">
          <div className="resumo-item">
            <Calendar className="resumo-icone" />
            <div>
              <h4>Total de Leituras</h4>
              <p>{estatisticasFiltradas.length}</p>
            </div>
          </div>
          
          <div className="resumo-item">
            <MapPin className="resumo-icone" />
            <div>
              <h4>Salas Ativas</h4>
              <p>{new Set(estatisticasFiltradas.map(item => item.sala)).size}</p>
            </div>
          </div>
          
          <div className="resumo-item">
            <QrCode className="resumo-icone" />
            <div>
              <h4>QR Codes Únicos</h4>
              <p>{new Set(estatisticasFiltradas.map(item => item.codigo)).size}</p>
            </div>
          </div>
        </div>

        <div className="estatisticas-tabela">
          <div className="tabela-header">
            <h3>Detalhamento das Leituras</h3>
            <span>{estatisticasFiltradas.length} registros encontrados</span>
          </div>

          {estatisticasFiltradas.length === 0 ? (
            <div className="sem-dados">
              <BarChart3 className="sem-dados-icone" />
              <p>Nenhuma leitura encontrada com os filtros aplicados</p>
            </div>
          ) : (
            <div className="tabela-container">
              <table className="tabela">
                <thead>
                  <tr>
                    <th>Data/Hora</th>
                    <th>Andar</th>
                    <th>Sala</th>
                    <th>Código QR</th>
                  </tr>
                </thead>
                <tbody>
                  {estatisticasFiltradas.map((item, index) => (
                    <tr key={index}>
                      <td>
                        <div className="data-hora">
                          <Clock className="data-icone" />
                          {new Date(item.data).toLocaleString()}
                        </div>
                      </td>
                      <td>{item.andar}</td>
                      <td>{item.sala}</td>
                      <td>
                        <code className="codigo-qr">{item.codigo}</code>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="acoes-estatisticas">
          <Link to="/" className="botao botao-contorno">
            <Home className="botao-icone" />
            <span>Voltar ao Início</span>
          </Link>
          
          <Link to="/scanner" className="botao botao-primario">
            <QrCode className="botao-icone" />
            <span>Ir para Scanner</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
