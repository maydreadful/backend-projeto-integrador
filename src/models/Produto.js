const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Produto = sequelize.define('Produto', {
  nome: {
    type: DataTypes.STRING,
    allowNull: false
  },
  descricao: {
    type: DataTypes.STRING
  },
  preco: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  codigoBarras: {
    type: DataTypes.STRING
  }
});

module.exports = Produto;