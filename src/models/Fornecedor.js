const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Certifique-se que o caminho está correto

const Fornecedor = sequelize.define('Fornecedor', {
  nome: {
    type: DataTypes.STRING,
    allowNull: false // Obrigatório
  },
  contato: {
    type: DataTypes.STRING,
    allowNull: true // Opcional para não travar o cadastro
  },
  email: {
    type: DataTypes.STRING,
    allowNull: true
  }
});

module.exports = Fornecedor;