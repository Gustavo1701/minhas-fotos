const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const routes = require('./routes/localizacao.routes.js');
const db = require('../backend/config/db.config.js');

const app = express();
const port = process.env.PORT || 4000;

// Middlewares
app.use(cors());
app.use(bodyParser.json());

// Rotas
app.use('/localizacoes', routes);

// Verifica a conexão com o banco de dados e inicia o servidor
db.sequelize.authenticate()
  .then(() => {
    console.log('Conexão com o banco de dados foi bem-sucedida!');
    db.sequelize.sync().then(() => {
      app.listen(port, () => {
        console.log(`Servidor rodando na porta ${port}`);
      });
    }).catch((error) => {
      console.error('Erro ao sincronizar o banco de dados:', error);
    });
  })
  .catch((error) => {
    console.error('Não foi possível conectar ao banco de dados:', error);
  });
