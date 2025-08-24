import { useState, useEffect, useRef, useCallback } from "react";
import { BrowserMultiFormatReader } from "@zxing/library";
import axios from "axios";
import { MapPin, Camera, CameraOff, Clock, QrCode, ArrowRight, BarChart3, Home, CheckCircle, AlertCircle } from "lucide-react";
import { Link } from 'react-router-dom';
import '../styles/main.scss';
import '../styles/scanner.scss';

export function ScannerPage() {
  const [localSelecionado, setLocalSelecionado] = useState("");
  const [salaSelecionada, setSalaSelecionada] = useState("");
  const [scannerAtivo, setScannerAtivo] = useState(false);
  const [visitasRecentes, setVisitasRecentes] = useState([]);
  const [erroMensagem, setErroMensagem] = useState("");
  const [statusMensagem, setStatusMensagem] = useState("");

  const videoRef = useRef(null);
  const leitorCodigo = useRef(null);
  const qrLidos = useRef(new Set());

  const locais = {
    "Patio": ["Sala 1", "Sala 2", "Sala 3", "Sala 4"],
    "Primeiro Andar": ["Sala 21", "Sala 22", "Sala 23", "Sala 24"],
    "Segundo Andar": ["Lab Informática 1", "Lab Informática 2", "Lab 26", "Lab 27"],
    "Terceiro Andar": ["Sala 28", "Sala 33"],
  };

  const opcoesSalas = localSelecionado ? locais[localSelecionado] || [] : [];

  const encontrarCameraTraseira = (devices) => {
    const cameraTraseira = devices.find(device => 
      device.label.toLowerCase().includes('back') ||
      device.label.toLowerCase().includes('traseira') ||
      device.label.toLowerCase().includes('rear') ||
      device.label.toLowerCase().includes('environment')
    );
    return cameraTraseira?.deviceId || devices[devices.length - 1]?.deviceId || devices[0]?.deviceId;
  };

  const pararScanner = () => {
    if (leitorCodigo.current) {
      leitorCodigo.current.reset();
      leitorCodigo.current = null;
    }
    setScannerAtivo(false);
    setStatusMensagem("");
    qrLidos.current.clear();
  };

  const registrarVisita = useCallback(async (qrCodeData) => {
    setStatusMensagem("Registrando visita...");

    try {
      await axios.post("https://backend-leitor-feira.onrender.com/visitas", {
        local: localSelecionado,
        sala: salaSelecionada,
        qrCodeData,
        timestamp: new Date().toISOString()
      });

      setStatusMensagem("Visita registrada com sucesso!");

      const novaVisita = {
        id: Date.now().toString(),
        local: localSelecionado,
        sala: salaSelecionada,
        timestamp: new Date().toLocaleString(),
        qrCodeData
      };

      setVisitasRecentes(prev => [novaVisita, ...prev].slice(0, 10));

      setTimeout(() => {
        pararScanner();
      }, 2000);
    } catch (err) {
      console.error("Erro ao registrar visita:", err);
      setErroMensagem("Erro ao registrar a visita. Tente novamente.");
      setStatusMensagem("");
    }
  }, [localSelecionado, salaSelecionada]);

  const iniciarScanner = async () => {
    if (!localSelecionado || !salaSelecionada) {
      setErroMensagem("Selecione um local e uma sala antes de iniciar o scanner.");
      return;
    }

    setErroMensagem("");
    setStatusMensagem("Solicitando permissão da câmera...");
    setScannerAtivo(true);
  };

  useEffect(() => {
    if (!scannerAtivo || !videoRef.current) return;

    const leitor = new BrowserMultiFormatReader();
    leitorCodigo.current = leitor;

    const startScanner = async () => {
      try {
        setStatusMensagem("Acessando câmeras...");
        await navigator.mediaDevices.getUserMedia({ video: true });

        const devices = await leitor.listVideoInputDevices();
        if (devices.length === 0) throw new Error("Nenhuma câmera encontrada");

        const deviceId = encontrarCameraTraseira(devices);
        setStatusMensagem("Iniciando câmera traseira...");

        leitor.decodeFromVideoDevice(deviceId, videoRef.current, async (resultado, erro) => {
          if (resultado) {
            const qrCodeData = resultado.getText();
            if (!qrLidos.current.has(qrCodeData)) {
              qrLidos.current.add(qrCodeData);
              leitor.reset();
              setScannerAtivo(false);
              await registrarVisita(qrCodeData);
            }
          }

          if (erro && erro.name !== "NotFoundException") {
            console.error("Erro na leitura:", erro);
          }
        });

        setStatusMensagem("Posicione o QR Code na área de leitura...");
      } catch (err) {
        console.error("Erro ao acessar a câmera:", err);
        setErroMensagem("Não foi possível acessar a câmera. Verifique as permissões.");
        pararScanner();
      }
    };

    startScanner();

    return () => {
      if (leitorCodigo.current) leitorCodigo.current.reset();
    };
  }, [scannerAtivo, registrarVisita]);

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
                  <video ref={videoRef} autoPlay muted playsInline className="scanner-video" />
                  <div className="scanner-overlay">
                    <div className="scanner-frame"></div>
                  </div>
                  <div className="scanner-status">
                    <Camera className="status-icon" />
                    <span>Câmera traseira ativa</span>
                  </div>
                </div>
              ) : (
                <div className="scanner-inactive">
                  <CameraOff className="status-icon" />
                  <span>Scanner inativo</span>
                </div>
              )}

              {statusMensagem && (
                <div className="alerta alerta-info">
                  <AlertCircle className="alerta-icone" />
                  <span>{statusMensagem}</span>
                </div>
              )}

              {erroMensagem && (
                <div className="alerta alerta-perigo">
                  <AlertCircle className="alerta-icone" />
                  <span>{erroMensagem}</span>
                </div>
              )}
            </div>
          </div>

          <div className="caixa">
            <div className="caixa-cabecalho">
              <div className="caixa-titulo">
                <MapPin className="caixa-titulo-icone" />
                <span>Selecionar Local</span>
              </div>
            </div>
            <div className="caixa-conteudo">
              <div className="formulario">
                <div className="formulario-grupo">
                  <label className="formulario-rotulo">Local:</label>
                  <select
                    value={localSelecionado}
                    onChange={(e) => { setLocalSelecionado(e.target.value); setSalaSelecionada(""); }}
                    className="formulario-selecao"
                    disabled={scannerAtivo}
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
                    disabled={!localSelecionado || scannerAtivo}
                    className="formulario-selecao"
                  >
                    <option value="">Escolha uma sala</option>
                    {opcoesSalas.map(sala => (
                      <option key={sala} value={sala}>{sala}</option>
                    ))}
                  </select>
                </div>

                {localSelecionado && salaSelecionada && (
                  <div className="alerta alerta-sucesso">
                    <CheckCircle className="alerta-icone" />
                    <span>Pronto para escanear em: <strong>{localSelecionado} - {salaSelecionada}</strong></span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {visitasRecentes.length > 0 && (
            <div className="caixa">
              <div className="caixa-cabecalho">
                <div className="caixa-titulo">
                  <Clock className="caixa-titulo-icone" />
                  <span>Visitas Recentes</span>
                </div>
              </div>
              <div className="caixa-conteudo">
                <div className="lista-visitas">
                  {visitasRecentes.map(visita => (
                    <div key={visita.id} className="item-visita">
                      <div className="info-visita">
                        <h4>{visita.local} - {visita.sala}</h4>
                        <p className="texto-pequeno">{visita.timestamp}</p>
                        {visita.qrCodeData && (
                          <p className="texto-pequeno qr-data">QR: {visita.qrCodeData}</p>
                        )}
                      </div>
                      <CheckCircle className="status-icon sucesso" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
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
