import cors from 'cors'
import express from 'express'
import Roteamento from '../Rotas.js'

const server = express()

server.use(express.json())

server.use(cors())

Roteamento(server)

const PORTA = process.env.PORTA;

server.listen(PORTA, () => {
    console.log('API subiu com sucesso na porta: ' + PORTA)
})