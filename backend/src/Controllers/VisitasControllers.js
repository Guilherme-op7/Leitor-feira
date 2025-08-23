import { Router } from "express";

import { buscarEstatisticasPorLocal, inserirVisita, limparTodasVisitas } from '../Repository/VisitasRepository.js'

const endpoints = Router()

endpoints.post('/visitas', async (req, res) => {
    try {
        const dados = req.body;
        if (!dados.local || !dados.sala) {
            return res.status(400).json({ error: "Local e sala são obrigatórios." });
        }

        const visita = await inserirVisita(dados);
        res.status(201).json(visita);
    }

    catch (err) {
        console.error("Erro ao registrar visita:", err);
        res.status(500).json({ error: "Erro ao registrar visita." });
    }
});

endpoints.get('/estatisticas', async (req, res) => {
    try {
        const resultados = await buscarEstatisticasPorLocal();

        res.json(resultados);
    }

    catch (err) {
        console.error("Erro ao buscar estatísticas:", err);

        res.status(500).json({ error: "Erro ao buscar estatísticas" });
    }
})

endpoints.delete('/estatisticas', async (req, res) => {
    try {
        const resultado = await limparTodasVisitas();
        res.json(resultado);
    } 
    
    catch (err) {
        console.error("Erro ao limpar visitas:", err);
        res.status(500).json({ error: "Erro ao limpar visitas." });
    }
});

export default endpoints;