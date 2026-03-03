const Produto = require('./Produto');
const Fornecedor = require('./Fornecedor');

Produto.belongsToMany(Fornecedor, { through: 'ProdutoFornecedor' });
Fornecedor.belongsToMany(Produto, { through: 'ProdutoFornecedor' });

module.exports = {};