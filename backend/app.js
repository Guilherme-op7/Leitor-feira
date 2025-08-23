import express from "express";
import cors from "cors";
import Roteamento from "./Routes/visitas.js";

const server = express();
server.use(cors());
server.use(express.json());


Roteamento(server);

const PORTA = process.env.PORT;

server.listen(PORTA, () => console.log("API rodando na porta 4000"));