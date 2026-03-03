const Produto = require('../models/Produto');

exports.criar = async (req, res) => {
  try {
    const produto = await Produto.create(req.body);
    res.status(201).json(produto);
  } catch (error) {
    res.status(500).json(error);
  }
};

exports.listar = async (req, res) => {
  const produtos = await Produto.findAll();
  res.json(produtos);
};

exports.atualizar = async (req, res) => {
  const { id } = req.params;
  await Produto.update(req.body, { where: { id } });
  res.json({ mensagem: "Atualizado com sucesso" });
};

exports.deletar = async (req, res) => {
  const { id } = req.params;
  await Produto.destroy({ where: { id } });
  res.json({ mensagem: "Deletado com sucesso" });
};