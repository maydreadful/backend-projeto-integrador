const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Fornecedor = sequelize.define('Fornecedor', {
  nome: {
    type: DataTypes.STRING,
    allowNull: false
  },
  cnpj: {
    type: DataTypes.STRING,
    allowNull: false
  },
  endereco: {
    type: DataTypes.STRING
  },
  contato: {
    type: DataTypes.STRING
  }
});

module.exports = Fornecedor;