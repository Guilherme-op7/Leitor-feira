import { useState, useEffect, useRef } from "react";
import { BrowserMultiFormatReader } from "@zxing/library";
import { Camera, CameraOff, QrCode, ArrowRight, Home, BarChart3 } from "lucide-react";
import { Link } from 'react-router-dom';
import { api } from "../config/api.js"; 
import '../styles/main.scss';
import '../styles/scanner.scss';

export function ScannerPage() {
  const [salaSelecionada, setSalaSelecionada] = useState("");
  const [scannerAtivo, setScannerAtivo] = useState(false);
  const [erroMensagem, setErroMensagem] = useState("");
  const [ultimaLeitura, setUltimaLeitura] = useState("");
  const [mostrarPopup, setMostrarPopup] = useState(false);

  const videoRef = useRef(null);
  const leitorRef = useRef(null);

  const salas = [
    "Sala 1", "Sala 2", "Sala 3", "Sala 4", "Sala 21", "Sala 22",
    "Sala 23", "Sala 24", "Lab Informática 1", "Lab Informática 2",
    "Lab 26", "Lab 27", "Sala 28", "Sala 33"
  ];

  function iniciarScanner() {
    if (!salaSelecionada) {
      setErroMensagem("Selecione a sala antes de iniciar.");
      return;
    }
    setErroMensagem("");
    setUltimaLeitura("");
    setScannerAtivo(true);
  }

  function pararScanner() {
    if (leitorRef.current) {
      leitorRef.current.reset();
      leitorRef.current = null;
    }
    if (videoRef.current?.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(trilha => trilha.stop());
      videoRef.current.srcObject = null;
    }
    setScannerAtivo(false);
  }

  useEffect(() => {
    if (!scannerAtivo || !videoRef.current) return;

    const leitor = new BrowserMultiFormatReader();
    leitorRef.current = leitor;

    leitor.decodeFromVideoDevice(null, videoRef.current, (resultado, erro) => {
      if (resultado) {
        const codigo = resultado.getText();
        if (localStorage.getItem("ultimaLeitura") === codigo) return;
        setUltimaLeitura(codigo);
        localStorage.setItem("ultimaLeitura", codigo);
      }
      if (erro && erro.name !== "NotFoundException") {
        console.error("Erro no scanner:", erro);
      }
    });

    return () => leitorRef.current?.reset();
  }, [scannerAtivo]);

  async function confirmarLeitura() {
    try {
      if (!ultimaLeitura || !salaSelecionada) {
        setErroMensagem("QR code ou sala inválidos.");
        return;
      }

      await api.post("/visitas", {
        codigo: ultimaLeitura,
        sala: salaSelecionada
      });

      setUltimaLeitura("");
      localStorage.removeItem("ultimaLeitura");

      setMostrarPopup(true);
      setTimeout(() => setMostrarPopup(false), 2000);
      setErroMensagem("");
    } 
    
    catch (erro) {
      setErroMensagem("Erro ao registrar leitura.");
      console.error("Erro no POST:", erro);
    }
  }

  return (
    <section className="corpo ativo">
      {mostrarPopup && <div className="popup-sucesso">Leitura registrada com sucesso!</div>}

      <nav className="cabeca">
        <div className="cabeca-container">
          <div className="cabeca-conteudo">
            <div className="cabeca-marca">
              <QrCode className="cabeca-logo" />
              <span className="cabeca-titulo">QRFrei</span>
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
        <h1 className="corpo-titulo">Scanner QR Code</h1>

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
                  <span>Scanner inativo - selecione uma sala!</span>
                </div>
              )}

              {ultimaLeitura && (
                <div className="scanner-overlay">
                  <div className="confirmacao-qr">
                    <h3>QR Code Detectado!</h3>
                    <p>Código: <strong>{ultimaLeitura}</strong></p>
                    <p>Sala: <strong>{salaSelecionada}</strong></p>
                    <div className="acoes-leitura">
                      <button className="botao botao-primario" onClick={confirmarLeitura}>Confirmar</button>
                      <button className="botao botao-contorno" onClick={() => {
                        setUltimaLeitura("");
                        localStorage.removeItem("ultimaLeitura");
                      }}>Cancelar</button>
                    </div>
                  </div>
                </div>
              )}

              {erroMensagem && <div className="alerta alerta-perigo">{erroMensagem}</div>}
            </div>
          </div>

          <div className="caixa">
            <div className="caixa-cabecalho">
              <div className="caixa-titulo">
                <span>Selecionar Sala</span>
              </div>
            </div>
            <div className="caixa-conteudo">
              <select
                value={salaSelecionada}
                onChange={(e) => setSalaSelecionada(e.target.value)}
                className="formulario-selecao"
              >
                <option value="">Escolha uma sala</option>
                {salas.map(sala => (
                  <option key={sala} value={sala}>{sala}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="acoes">
          <button
            className="botao botao-primario"
            onClick={scannerAtivo ? pararScanner : iniciarScanner}
            disabled={!salaSelecionada}
          >
            <QrCode className="botao-icone" />
            <span>{scannerAtivo ? "Parar Scanner" : "Iniciar Scanner"}</span>
            <ArrowRight className="botao-icone" />
          </button>
        </div>
      </div>
    </section>
  );
}
