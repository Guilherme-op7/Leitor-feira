import inserirVisita from "../Controller/VisitasController.js";
import buscarEstatisticas from "../Controller/VisitasController.js";
import limparTodasVisitas from "../Controller/VisitasController.js";
export default function Roteamento(api) {
    api.use(inserirVisita)
    api.use(buscarEstatisticas)
    api.use(limparTodasVisitas)
}