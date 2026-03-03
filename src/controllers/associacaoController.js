const Produto = require('../models/Produto');
const Fornecedor = require('../models/Fornecedor');

exports.associar = async (req, res) => {
  const { produtoId, fornecedorId } = req.body;

  const produto = await Produto.findByPk(produtoId);
  const fornecedor = await Fornecedor.findByPk(fornecedorId);

  await produto.addFornecedor(fornecedor);

  res.json({ mensagem: "Associado com sucesso" });
};

exports.listarProdutosDoFornecedor = async (req, res) => {
  const { id } = req.params;

  const fornecedor = await Fornecedor.findByPk(id, {
    include: Produto
  });

  res.json(fornecedor);
};