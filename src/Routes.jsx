import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Home } from "./pages/Home";
import { ScannerPage } from "./Components/Scanner";
import { EstatisticasPage } from "./pages/Estatisticas";
import { LoginPage } from "./Components/Login";

function ProtectedRoute({ children, requireAdmin = false }) {
  const token = localStorage.getItem("token");
  const usuario = localStorage.getItem("usuario");

  if (!token || !usuario) {
    return <Navigate to="/login" replace />;
  }

  if (requireAdmin) {
    try {
      const usuarioObj = JSON.parse(usuario);
      if (!usuarioObj.isAdmin) {
        return <Navigate to="/scanner" replace />;
      }
    } 
    
    catch (error) {
      return <Navigate to="/login" replace />;
    }
  }

  return children;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route 
          path="/scanner" 
          element={
            <ProtectedRoute>
              <ScannerPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/estatisticas" 
          element={
            <ProtectedRoute requireAdmin={true}>
              <EstatisticasPage />
            </ProtectedRoute>
          } 
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;