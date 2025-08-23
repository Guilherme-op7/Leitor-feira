import { Router } from "express";
import { inserirVisita, buscarEstatisticas, limparTodasVisitas } from "../Repository/VisitasRepository.js";

const endpoints = Router();

endpoints.post("/visitas", async (req, res, next) => {
    try {
        const { local, sala } = req.body;
        const id = await inserirVisita(local, sala);
        res.status(201).json({ success: true, id });
    } catch (err) {
        next(err);
    }
});

endpoints.get("/estatisticas", async (req, res, next) => {
    try {
        const stats = await buscarEstatisticas();
        res.json(stats);
    } catch (err) {
        next(err);
    }
});

endpoints.delete("/visitas", async (req, res, next) => {
    try {
        await limparTodasVisitas();
        res.json({ success: true });
    } catch (err) {
        next(err);
    }
});

export default endpoints;
