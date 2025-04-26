const express = require('express');
const cors = require('cors');
const routes = require('./routes/localizacao.routes.js');
const db = require('./config/db.config.js');

const app = express();
const PORT = process.env.PORT || 4000;

// Middlewares
app.use(cors());
app.use(express.json()); // substitui body-parser

// Rotas
app.use('/localizacoes', routes);

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
