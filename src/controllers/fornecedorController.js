const Fornecedor = require('../models/Fornecedor');

exports.criar = async (req, res) => {
  const fornecedor = await Fornecedor.create(req.body);
  res.status(201).json(fornecedor);
};

exports.listar = async (req, res) => {
  const fornecedores = await Fornecedor.findAll();
  res.json(fornecedores);
};

exports.deletar = async (req, res) => {
  const { id } = req.params;
  await Fornecedor.destroy({ where: { id } });
  res.json({ mensagem: "Deletado com sucesso" });
};