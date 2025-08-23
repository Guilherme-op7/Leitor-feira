import mysql from 'mysql2/promise';
import 'dotenv/config';

const db = await mysql.createConnection(process.env.MYSQL_PUBLIC_URL);
export default db;