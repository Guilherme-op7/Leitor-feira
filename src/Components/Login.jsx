import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { verificarCredenciais } from "../config/users";
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

    setTimeout(() => {
      try {

        const usuario = verificarCredenciais(email, senha);

        if (usuario) {
          const tokenMock = `mock_token_${usuario.id}_${Date.now()}`;

          localStorage.setItem("token", tokenMock);
          localStorage.setItem("usuario", JSON.stringify(usuario));
          
          console.log("Login realizado com sucesso:", usuario);
          navigate("/scanner");
        }
        
        else {
          setErro("Email ou senha incorretos");
        }
      } 
      
      catch (err) {
        setErro("Erro interno do sistema");
        console.error("Erro no login:", err);
      } 
      
      finally {
        setCarregando(false);
      }
    }, 1000); 
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <Lock className="login-icon" />
          <h1>Login</h1>
          <p>Acesse o sistema de leitor QR</p>
        </div>

        <div className="credenciais-teste">
          <h3>Credenciais para Teste:</h3>
          <div className="credenciais-lista">
            <div className="credencial-item">
              <strong>Admin:</strong> admin@teste.com / admin123
            </div>
            <div className="credencial-item">
              <strong>Usuário:</strong> usuario@teste.com / 123456
            </div>
            <div className="credencial-item">
              <strong>Teste:</strong> teste@teste.com / teste123
            </div>
          </div>
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
