# Sistema de Leitor QR - QRFrei

Sistema completo para registro de visitas usando códigos QR em diferentes locais e salas.

## 🚀 Funcionalidades

### 🔐 Sistema de Autenticação
- **Login seguro** com email e senha
- **Controle de acesso** baseado em permissões
- **Proteção de rotas** para usuários autenticados
- **Acesso administrativo** para estatísticas completas

### 📱 Scanner QR
- **Leitura de códigos QR** em tempo real
- **Seleção de sala** para registrar localização
- **Confirmação manual** antes de registrar visita
- **Histórico local** das últimas leituras
- **Sistema local** sem necessidade de backend

### 📊 Estatísticas (Admin)
- **Visão completa** de todas as visitas registradas
- **Filtros avançados** por andar, sala e data
- **Exportação CSV** dos dados filtrados
- **Resumo estatístico** com totais e contadores
- **Tabela detalhada** com data/hora, local e código QR

## 🛠️ Tecnologias Utilizadas

- **Frontend**: React + Vite
- **Estilização**: SCSS com design responsivo
- **Autenticação**: Sistema local com localStorage
- **Leitor QR**: ZXing Library
- **Ícones**: Lucide React
- **Roteamento**: React Router v6

## 📁 Estrutura do Projeto

```
src/
├── Components/
│   ├── Login.jsx          # Tela de autenticação
│   └── Scanner.jsx        # Scanner QR principal
├── pages/
│   ├── Home.jsx           # Página inicial
│   └── Estatisticas.jsx   # Estatísticas (admin)
├── config/
│   └── users.js           # Usuários e dados mockados
├── styles/
│   ├── main.scss          # Estilos globais
│   ├── login.scss         # Estilos do login
│   ├── scanner.scss       # Estilos do scanner
│   └── estatisticas.scss  # Estilos das estatísticas
├── Routes.jsx             # Configuração de rotas
└── main.jsx              # Ponto de entrada
```

## 🔧 Configuração

### 1. Instalação de Dependências
```bash
npm install
```

### 2. Executar o Projeto
```bash
npm run dev
```

## 🔑 **Credenciais para Teste**

O sistema vem com usuários padrão para teste:

### **Administrador (Acesso Total)**
- **Email**: `admin@teste.com`
- **Senha**: `admin123`
- **Permissões**: Scanner + Estatísticas completas

### **Usuário Comum (Scanner Apenas)**
- **Email**: `usuario@teste.com`
- **Senha**: `123456`
- **Permissões**: Apenas Scanner

### **Usuário Teste (Scanner Apenas)**
- **Email**: `teste@teste.com`
- **Senha**: `teste123`
- **Permissões**: Apenas Scanner

## 🚀 Como Usar

### 1. **Acesso Inicial**
- Acesse a página inicial
- Clique em "Entrar" para fazer login
- Use uma das credenciais de teste acima

### 2. **Scanner QR**
- Faça login no sistema
- Selecione a sala onde está localizado
- Clique em "Iniciar Scanner"
- Aponte a câmera para um código QR
- Confirme a leitura para registrar a visita

### 3. **Estatísticas (Admin)**
- Faça login como administrador (`admin@teste.com`)
- Acesse a página de estatísticas
- Use filtros para buscar dados específicos
- Exporte dados em CSV se necessário

## 🔒 Segurança

- **Autenticação obrigatória** para funcionalidades sensíveis
- **Proteção de rotas** com verificação de permissões
- **Sistema local** sem exposição de dados externos
- **Logout automático** em caso de erro

## 📱 Responsividade

O sistema é totalmente responsivo e funciona em:
- 📱 Dispositivos móveis
- 💻 Tablets
- 🖥️ Desktops

## 🔄 Fluxo de Dados

1. **Login** → Verificação local de credenciais
2. **Scanner** → Leitura QR + confirmação
3. **Registro** → Salvamento local + dados mockados
4. **Estatísticas** → Consulta dados filtrados
5. **Exportação** → Download CSV dos dados

## 🧪 **Modo de Teste**

Este sistema está configurado para funcionar **sem backend**:

- ✅ **Autenticação local** com usuários padrão
- ✅ **Dados mockados** para estatísticas
- ✅ **Scanner funcional** com câmera
- ✅ **Histórico local** das leituras
- ✅ **Filtros e exportação** funcionais

## 🐛 Solução de Problemas

### Scanner não funciona
- Verifique permissões da câmera
- Certifique-se de estar usando HTTPS
- Teste em diferentes navegadores

### Erro de autenticação
- Use as credenciais corretas listadas acima
- Verifique se não há erros no console
- Faça logout e login novamente

### Estatísticas não carregam
- Verifique se está logado como admin
- Confirme se o usuário tem `isAdmin: true`
- Verifique o console para erros

## 📞 Suporte

Para suporte técnico ou dúvidas:
- Verifique os logs do console do navegador (F12)
- Confirme se está usando as credenciais corretas
- Teste em diferentes dispositivos/navegadores

## 📄 Licença

Este projeto é desenvolvido para uso interno da organização QRFrei.
