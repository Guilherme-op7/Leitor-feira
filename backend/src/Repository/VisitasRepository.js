import db from "../Repository/connection.js";

export async function inserirVisita(local, sala) {
    const [result] = 
        await db.query(
        "INSERT INTO qrdb (local, sala, timestamp) VALUES (?, ?, NOW())",
        [local, sala]
    );
    return result.insertId;
}

export async function buscarEstatisticas() {
    const [total] = 
        await db.query("SELECT COUNT(*) as total FROM qrdb");

    const [locais] = 
        await db.query(
        "SELECT COUNT(DISTINCT local) as locations FROM qrdb"
    );

    return {
        total: total[0].total,
        locations: locais[0].locations
    };
}

export async function limparTodasVisitas() {
    await db.query("DELETE FROM qrdb");
}
