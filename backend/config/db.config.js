const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.PGDATABASE,
  process.env.PGUSER,
  process.env.PGPASSWORD,
  {
    host: process.env.PGHOST,
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false // importante para a Neon funcionar
      }
    }
  }
);

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Importar models
db.Localizacao = require('../models/localizacao.model.js')(sequelize, DataTypes);

module.exports = db;
