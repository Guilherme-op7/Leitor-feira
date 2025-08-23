import mysql from 'mysql2/promise'
import 'dotenv/config'

let connection = await mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PWD,
    database: process.env.MYSQL_DB
})

console.log('Banco de Dados Subiu!')

export default connection