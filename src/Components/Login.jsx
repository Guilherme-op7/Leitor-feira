import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Lock, User, Eye, EyeOff } from "lucide-react";
import "../styles/main.scss";
import "../styles/login.scss";

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);
  const navigate = useNavigate();

  const fazerLogin = async (e) => {
    e.preventDefault();
    setErro("");
    setCarregando(true);

    try {

      const resposta = await axios.post("http://localhost:4000/login", { email, senha });
      const { token, usuario } = resposta.data;

      const usuarioComAdmin = { ...usuario, isAdmin: usuario.tipo === "admin" };

      localStorage.setItem("token", token);
      localStorage.setItem("usuario", JSON.stringify(usuarioComAdmin));

      if (usuario.tipo === "admin") {
        navigate("/estatisticas");
      } else {
        navigate("/scanner");
      }
    } 
    catch (err) {
      console.error("Erro no login:", err);
      setErro("Email ou senha incorretos");
    } 
    finally {
      setCarregando(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <Lock className="login-icon" />
          <h1>Login</h1>
          <p>Acesse o sistema de leitor QR</p>
        </div>

        <form onSubmit={fazerLogin} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <div className="input-wrapper">
              <User className="input-icon" />
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Digite seu email"
                required
                disabled={carregando}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="senha">Senha</label>
            <div className="input-wrapper">
              <Lock className="input-icon" />
              <input
                type={mostrarSenha ? "text" : "password"}
                id="senha"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                placeholder="Digite sua senha"
                required
                disabled={carregando}
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setMostrarSenha(!mostrarSenha)}
                disabled={carregando}
              >
                {mostrarSenha ? <EyeOff /> : <Eye />}
              </button>
            </div>
          </div>

          {erro && <div className="error-message">{erro}</div>}

          <button
            type="submit"
            className="login-button"
            disabled={carregando || !email || !senha}
          >
            {carregando ? "Entrando..." : "Entrar"}
          </button>
        </form>
      </div>
    </div>
  );
}
