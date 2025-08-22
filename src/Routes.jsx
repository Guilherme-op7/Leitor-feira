import { BrowserRouter, Routes, Route } from "react-router-dom";

import { HomePage } from "./pages/Home.jsx";
import { ScannerPage } from "./Components/Scanner.jsx";
import { EstatisticasPage } from "./pages/Estatisticas.jsx";


export default function Navegacao() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/scanner' element={<ScannerPage />} />
        <Route path='/estatisticas' element={<EstatisticasPage />} />
      </Routes>
    </BrowserRouter>
  )
}