const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const routes = require('./routes/localizacao.routes.js'); // ajuste conforme sua estrutura
const db = require('../backend/config/db.config.js'); // conexão com o banco de dados

const app = express();
const PORT = process.env.PORT || 4000;

// Middlewares
app.use(cors()); // permite requisições de outros domínios (como seu frontend)
app.use(bodyParser.json()); // permite interpretar JSON no body das requisições

// Rotas
app.use('/localizacoes', routes);

// Verifica a conexão com o banco de dados
db.sequelize.authenticate()
  .then(() => {
    console.log('Conexão com o banco de dados foi bem-sucedida!');
    // Sincroniza o banco e inicia o servidor
    db.sequelize.sync().then(() => {
      app.listen(PORT, () => {
        console.log(`Servidor rodando na porta ${PORT}`);
      });
    }).catch((error) => {
      console.error('Erro ao sincronizar o banco de dados:', error);
    });
  })
  .catch((error) => {
    console.error('Não foi possível conectar ao banco de dados:', error);
  });
