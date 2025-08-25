import { useState, useEffect, useRef } from "react";
import { BrowserMultiFormatReader } from "@zxing/library";
import axios from "axios";
import { Camera, CameraOff, QrCode, ArrowRight, Home, BarChart3 } from "lucide-react";
import { Link } from 'react-router-dom';
import '../styles/main.scss';
import '../styles/scanner.scss';

export function ScannerPage() {
  const [localSelecionado, setLocalSelecionado] = useState("");
  const [salaSelecionada, setSalaSelecionada] = useState("");
  const [scannerAtivo, setScannerAtivo] = useState(false);
  const [erroMensagem, setErroMensagem] = useState("");
  const [ultimaLeitura, setUltimaLeitura] = useState("");

  const videoRef = useRef(null);
  const leitorRef = useRef(null);

  const locais = {
    "Patio": ["Sala 1", "Sala 2", "Sala 3", "Sala 4"],
    "Primeiro Andar": ["Sala 21", "Sala 22", "Sala 23", "Sala 24"],
    "Segundo Andar": ["Lab Informática 1", "Lab Informática 2", "Lab 26", "Lab 27"],
    "Terceiro Andar": ["Sala 28", "Sala 33"],
  };

  const opcoesSalas = localSelecionado ? locais[localSelecionado] || [] : [];

  const iniciarScanner = () => {
    if (!localSelecionado || !salaSelecionada) {
      setErroMensagem("Selecione local e sala antes de iniciar.");
      return;
    }

    setErroMensagem("");
    setUltimaLeitura("");
    setScannerAtivo(true);
  };

  const pararScanner = () => {
    if (leitorRef.current) {
      leitorRef.current.reset();
      leitorRef.current = null;
    }

    if (videoRef.current?.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }

    setScannerAtivo(false);
  };


  useEffect(() => {
    if (!scannerAtivo || !videoRef.current) return;

    const leitor = new BrowserMultiFormatReader();
    leitorRef.current = leitor;

    leitor.decodeFromVideoDevice(null, videoRef.current, async (resultado, erro) => {
      if (resultado) {
        setUltimaLeitura(resultado.getText());
        console.log("QR Code lido:", resultado.getText());
        console.log("Local:", localSelecionado, "Sala:", salaSelecionada);

        try {
          await axios.post("https://backend-leitor-feira.onrender.com/visitas", {
            local: localSelecionado,
            sala: salaSelecionada
          });
          console.log("Visita registrada no backend com sucesso!");
        } catch (err) {
          console.error("Erro ao registrar visita no backend:", err);
          setErroMensagem("Erro ao registrar visita no servidor.");
        }

        pararScanner();
      }

      if (erro && erro.name !== "NotFoundException") {
        console.error("Erro no scanner:", erro);
      }
    });

    return () => {
      if (leitorRef.current) {
        leitorRef.current.reset();
      }
    };
  }, [scannerAtivo, localSelecionado, salaSelecionada]);

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
              <Link to="/scanner" className="cabeca-link ativo">
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

      <div className="corpo-container">
        <div className="corpo-cabecalho">
          <h1 className="corpo-titulo">Scanner QR Code</h1>
          <p className="corpo-desc">Registre a passagem de pessoas pelos locais</p>
        </div>

        <div className="scanner-layout">
          <div className="caixa">
            <div className="caixa-cabecalho">
              <div className="caixa-titulo">
                <Camera className="caixa-titulo-icone" />
                <span>Scanner de Código QR</span>
              </div>
            </div>
            <div className="caixa-conteudo">
              {scannerAtivo ? (
                <div className="scanner-area">
                  <video ref={videoRef} autoPlay muted className="scanner-video" />
                  <div className="scanner-status">
                    <Camera className="status-icon" />
                    <span>Scanner ativo - Aponte para um QR Code</span>
                  </div>
                </div>
              ) : (
                <div className="scanner-inactive">
                  <CameraOff className="status-icon" />
                  <span>Scanner inativo</span>
                </div>
              )}

              {ultimaLeitura && (
                <div className="alerta alerta-sucesso">
                  <strong>QR Code lido com sucesso!</strong><br />
                  Conteúdo: {ultimaLeitura}<br />
                  Local: {localSelecionado} - {salaSelecionada}
                </div>
              )}

              {erroMensagem && <div className="alerta alerta-perigo">{erroMensagem}</div>}
            </div>
          </div>

          <div className="caixa">
            <div className="caixa-cabecalho">
              <div className="caixa-titulo">
                <span>Selecionar Local e Sala</span>
              </div>
            </div>
            <div className="caixa-conteudo">
              <div className="formulario">
                <div className="formulario-grupo">
                  <label className="formulario-rotulo">Local:</label>
                  <select
                    value={localSelecionado}
                    onChange={(e) => setLocalSelecionado(e.target.value)}
                    className="formulario-selecao"
                  >
                    <option value="">Escolha um local</option>
                    {Object.keys(locais).map(local => (
                      <option key={local} value={local}>{local}</option>
                    ))}
                  </select>
                </div>

                <div className="formulario-grupo">
                  <label className="formulario-rotulo">Sala:</label>
                  <select
                    value={salaSelecionada}
                    onChange={(e) => setSalaSelecionada(e.target.value)}
                    disabled={!localSelecionado}
                    className="formulario-selecao"
                  >
                    <option value="">Escolha uma sala</option>
                    {opcoesSalas.map(sala => (
                      <option key={sala} value={sala}>{sala}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="acoes">
          <button
            className="botao botao-primario"
            onClick={scannerAtivo ? pararScanner : iniciarScanner}
            disabled={!localSelecionado || !salaSelecionada}
          >
            <QrCode className="botao-icone" />
            <span>{scannerAtivo ? "Parar Scanner" : "Iniciar Scanner"}</span>
            <ArrowRight className="botao-icone" />
          </button>

          <Link to="/estatisticas" className="botao botao-contorno">
            <BarChart3 className="botao-icone" />
            <span>Ver Estatísticas</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
