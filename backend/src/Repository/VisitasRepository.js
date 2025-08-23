import db from "../Repository/connection.js";

export async function inserirVisita(local, sala) {
    const dataAtual = new Date(); 

    const [result] = await db.query(
        "INSERT INTO visitass (local, sala, data) VALUES (?, ?, ?)",
        [local, sala, dataAtual]
    );

    return result.insertId;
}

export async function buscarEstatisticas() {
    const [total] = 
        await db.query("SELECT COUNT(*) as total FROM visitass");

    const [locais] = 
        await db.query(
        "SELECT COUNT(DISTINCT local) as locations FROM visitass"
    );

    return {
        total: total[0].total,
        locations: locais[0].locations
    };
}

export async function limparTodasVisitas() {
    await db.query("DELETE FROM visitass");
}
