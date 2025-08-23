import connection from "./connection.js";

export async function inserirVisita(dados) {

  try {
    const agora = new Date(); 
    const [resultados] = await connection.query(

      `INSERT INTO visitas (local, sala, data) VALUES (?, ?, ?)`,
      [dados.local, dados.sala, agora]
    );

    return {
      id: resultados.insertId,
      local: dados.local,
      sala: dados.sala,
      data: new Date()
    };
  } 
  
  catch (err) {
    console.error("Erro ao inserir visita:", err);
    throw err;
  }
}

export async function buscarEstatisticasPorLocal() {

  try {
    const [rows] = await connection.query(
      `SELECT local, COUNT(*) AS total_visitas, COUNT(DISTINCT sala) AS salas_ativas
       FROM visitas
       GROUP BY local
       ORDER BY local ASC`
    );

    return rows;
  } 
  
  catch (err) {
    console.error("Erro ao buscar estatísticas por local:", err);
    throw err;
  }
}

export async function limparTodasVisitas() {
    
  try {
    await connection.query(`DELETE FROM visitas`);
    return { message: "Todas as visitas foram removidas com sucesso." };
  } 
  
  catch (err) {
    console.error("Erro ao limpar visitas:", err);
    throw err;
  }
}