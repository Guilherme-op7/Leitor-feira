import { useState, useEffect, useRef } from "react";
import { BrowserMultiFormatReader } from "@zxing/library";
import axios from "axios";
import { MapPin, Camera, CameraOff, Clock, QrCode, ArrowRight, BarChart3, Home } from "lucide-react";
import { Link } from 'react-router-dom';
import '../styles/main.scss';
import '../styles/scanner.scss';

export function ScannerPage() {
  const [localSelecionado, setLocalSelecionado] = useState("");
  const [salaSelecionada, setSalaSelecionada] = useState("");
  const [scannerAtivo, setScannerAtivo] = useState(false);
  const [visitasRecentes, setVisitasRecentes] = useState([]);
  const [erroMensagem, setErroMensagem] = useState("");
  const [sucessoMensagem, setSucessoMensagem] = useState("");
  const [cameras, setCameras] = useState([]);
  const [cameraSelecionada, setCameraSelecionada] = useState(null);

  const videoRef = useRef(null);
  const leitorCodigo = useRef(null);

  const locais = {
    "Patio": ["Sala 1", "Sala 2", "Sala 3", "Sala 4"],
    "Primeiro Andar": ["Sala 21", "Sala 22", "Sala 23", "Sala 24"],
    "Segundo Andar": ["Lab Informática 1", "Lab Informática 2", "Lab 26", "Lab 27"],
    "Terceiro Andar": ["Sala 28", "Sala 33"],
  };

  const opcoesSalas = localSelecionado ? locais[localSelecionado] || [] : [];

  const iniciarScanner = () => {
    if (!localSelecionado || !salaSelecionada || !cameraSelecionada) {
      setErroMensagem("Selecione local, sala e câmera antes de iniciar.");
      return;
    }
    setErroMensagem("");
    setSucessoMensagem("");
    setScannerAtivo(true);
  };

  const pararScanner = () => {
    if (leitorCodigo.current) {
      leitorCodigo.current.reset();
      leitorCodigo.current = null;
    }
    setScannerAtivo(false);
  };

  useEffect(() => {
    const listarCameras = async () => {
      try {
        const leitor = new BrowserMultiFormatReader();
        const devices = await leitor.listVideoInputDevices();
        setCameras(devices);
        if (devices.length > 0) {

          const backCamera = devices.find(d => /back|rear/i.test(d.label)) || devices[0];
          setCameraSelecionada(backCamera.deviceId);
        }
      } catch (err) {
        console.error("Erro ao listar câmeras:", err);
        setErroMensagem("Não foi possível acessar as câmeras do dispositivo.");
      }
    };
    listarCameras();
  }, []);

  useEffect(() => {
    if (!scannerAtivo || !videoRef.current || !cameraSelecionada) return;

    const leitor = new BrowserMultiFormatReader();
    leitorCodigo.current = leitor;

    const startScanner = async () => {
      try {
        leitor.decodeFromVideoDevice(cameraSelecionada, videoRef.current, async (resultado, erro) => {
          if (resultado) {
            console.log("QR Code lido:", resultado.getText());

            const novaVisita = {
              id: Date.now().toString(),
              local: localSelecionado,
              sala: salaSelecionada,
              timestamp: new Date().toLocaleString(),
            };
            setVisitasRecentes(prev => [novaVisita, ...prev].slice(0, 10));
            setSucessoMensagem("Visita registrada com sucesso!");

            try {
              await axios.post("https://backend-leitor-feira.onrender.com/visitas", {
                local: localSelecionado,
                sala: salaSelecionada
              });
            } catch (err) {
              console.error("Erro ao registrar visita no backend:", err);
              setErroMensagem("Erro ao registrar visita no servidor.");
            }

            pararScanner();
          }
          if (erro && erro.name !== "NotFoundException") console.error(erro);
        });
      } catch (err) {
        console.error("Erro ao iniciar scanner:", err);
        setErroMensagem("Não foi possível iniciar o scanner.");
        pararScanner();
      }
    };

    startScanner();
    return () => leitor.reset();
  }, [scannerAtivo, cameraSelecionada, localSelecionado, salaSelecionada]);

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
                    <span>Scanner ativo</span>
                  </div>
                </div>
              ) : (
                <div className="scanner-inactive">
                  <CameraOff className="status-icon" />
                  <span>Scanner inativo</span>
                </div>
              )}
              {erroMensagem && <div className="alerta alerta-perigo">{erroMensagem}</div>}
              {sucessoMensagem && <div className="alerta alerta-sucesso">{sucessoMensagem}</div>}
            </div>
          </div>

          <div className="caixa">
            <div className="caixa-cabecalho">
              <div className="caixa-titulo">
                <MapPin className="caixa-titulo-icone" />
                <span>Selecionar Local e Câmera</span>
              </div>
            </div>
            <div className="caixa-conteudo">
              <div className="formulario">
                <div className="formulario-grupo">
                  <label className="formulario-rotulo">Local:</label>
                  <select
                    value={localSelecionado}
                    onChange={(e) => {
                      setLocalSelecionado(e.target.value);
                      setSalaSelecionada("");
                    }}
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

                {cameras.length > 0 && (
                  <div className="formulario-grupo">
                    <label className="formulario-rotulo">Câmera:</label>
                    <select
                      value={cameraSelecionada || ""}
                      onChange={(e) => setCameraSelecionada(e.target.value)}
                      className="formulario-selecao"
                    >
                      {cameras.map(cam => (
                        <option key={cam.deviceId} value={cam.deviceId}>
                          {cam.label || "Câmera desconhecida"}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {localSelecionado && salaSelecionada && cameraSelecionada && (
                  <div className="alerta alerta-sucesso">
                    Pronto para escanear em: <strong>{localSelecionado} - {salaSelecionada}</strong>
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
                      </div>
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
            disabled={!localSelecionado || !salaSelecionada || !cameraSelecionada}
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
