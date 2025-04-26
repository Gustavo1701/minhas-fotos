// backend/config/db.config.js
const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config();

// Importar as configurações de banco de dados
const config = require('./db.config.js');

// Definir o ambiente (desenvolvimento ou produção)
const environment = process.env.NODE_ENV || 'development'; // Padrão para 'development' se NODE_ENV não for definido

// Usar a configuração correta com base no ambiente
const dbConfig = config[environment];

// Criar a instância do Sequelize com as configurações adequadas
const sequelize = new Sequelize(
  dbConfig.use_env_variable ? process.env[dbConfig.use_env_variable] : dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  {
    host: dbConfig.host,
    dialect: dbConfig.dialect,
    dialectOptions: dbConfig.dialectOptions, // SSL para produção (Heroku)
  }
);

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Importar models
db.Localizacao = require('../models/localizacao.model.js')(sequelize, DataTypes);

module.exports = db;
