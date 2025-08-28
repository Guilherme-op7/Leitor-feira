export const usuariosPadrao = [
  {
    id: "1",
    email: "admin@teste.com",
    senha: "admin123",
    nome: "Administrador",
    isAdmin: true
  },
  {
    id: "2", 
    email: "usuario@teste.com",
    senha: "123456",
    nome: "Usuário Comum",
    isAdmin: false
  },
  {
    id: "3",
    email: "teste@teste.com", 
    senha: "teste123",
    nome: "Usuário Teste",
    isAdmin: false
  }
];

export const verificarCredenciais = (email, senha) => {
  return usuariosPadrao.find(
    usuario => usuario.email === email && usuario.senha === senha
  );
};

export const estatisticasMock = [
  {
    id: "1",
    data: "2024-01-15T10:30:00.000Z",
    andar: "Primeiro Andar",
    sala: "Sala 21",
    codigo: "1"
  },
  {
    id: "2", 
    data: "2024-01-15T11:15:00.000Z",
    andar: "Segundo Andar",
    sala: "Lab Informática 1",
    codigo: "2"
  },
  {
    id: "3",
    data: "2024-01-15T14:20:00.000Z", 
    andar: "Patio",
    sala: "Sala 1",
    codigo: "3"
  },
  {
    id: "4",
    data: "2024-01-15T16:45:00.000Z",
    andar: "Terceiro Andar", 
    sala: "Sala 28",
    codigo: "4"
  },
  {
    id: "5",
    data: "2024-01-16T09:00:00.000Z",
    andar: "Segundo Andar",
    sala: "Lab 26", 
    codigo: "5"
  }
];

export const adicionarVisita = (codigo, sala) => {
  const novaVisita = {
    id: Date.now().toString(),
    data: new Date().toISOString(),
    andar: determinarAndar(sala),
    sala: sala,
    codigo: codigo
  };
  
  estatisticasMock.unshift(novaVisita);
  return novaVisita;
};

const determinarAndar = (sala) => {
  if (["Sala 1", "Sala 2", "Sala 3", "Sala 4"].includes(sala)) {
    return "Patio";
  }
  
  else if (["Sala 21", "Sala 22", "Sala 23", "Sala 24"].includes(sala)) {
    return "Primeiro Andar";
  } 
  
  else if (["Lab Informática 1", "Lab Informática 2", "Lab 26", "Lab 27"].includes(sala)) {
    return "Segundo Andar";
  } 
  
  else if (["Sala 28", "Sala 33"].includes(sala)) {
    return "Terceiro Andar";
  }
  
  return "Local Desconhecido";
};
