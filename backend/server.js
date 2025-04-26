const express = require('express');
const cors = require('cors');
const routes = require('./routes/localizacao.routes.js');
const db = require('./config/db.config.js');
const path = require('path');  // Importa o módulo path do Node.js

const app = express();
const PORT = process.env.PORT || 4000;


// Middlewares
app.use(cors());
app.use(express.json()); // substitui body-parser

// Serve arquivos estáticos da pasta 'frontend' (caminho absoluto)
app.use(express.static(path.join(__dirname, '../frontend')));

// Rotas
app.use('/localizacoes', routes);

// Rota para página principal: retorna o index.html do frontend
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});


// Função para iniciar o servidor
const startServer = async () => {
  try {
    await db.sequelize.authenticate();
    console.log('✅ Conexão com o banco de dados foi bem-sucedida!');
    
    await db.sequelize.sync(); // { alter: true } ou { force: true } se desejar
    console.log('✅ Banco de dados sincronizado.');

    app.listen(PORT, () => {
      console.log(`🚀 Servidor rodando na porta ${PORT}`);
    });
  } catch (error) {
    console.error('❌ Erro ao iniciar o servidor:', error);
    process.exit(1); // importante para o Heroku entender que falhou
  }
};

startServer();
