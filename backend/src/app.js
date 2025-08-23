import express from "express";
import cors from "cors";
import Roteamento from "./Routes/visitas.js";

const server = express();
server.use(cors());
server.use(express.json());


Roteamento(server);

const PORT = process.env.PORT || 4000;

server.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));