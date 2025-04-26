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

// Inicia o servidor e sincroniza o banco
db.sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
  });
});
