import VisitasControllers from './src/Controllers/VisitasControllers.js'

export default function Roteamento(api) {
    api.use(VisitasControllers)
}