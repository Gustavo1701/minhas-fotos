module.exports = (sequelize, DataTypes) => {
    const Localizacao = sequelize.define('Localizacao', {
      ip: {
        type: DataTypes.STRING,
        allowNull: false
      },
      latitude: {
        type: DataTypes.FLOAT,
        allowNull: false
      },
      longitude: {
        type: DataTypes.FLOAT,
        allowNull: false
      }
    }, {
      tableName: 'localizacoes' // nome fixo da tabela no banco
    });
  
    return Localizacao;
  };
  