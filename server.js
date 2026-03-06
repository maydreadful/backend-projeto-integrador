const express = require("express");
const cors = require("cors");
const { Sequelize, DataTypes } = require("sequelize");

const app = express();

app.use(cors());
app.use(express.json());

/* =============================
   BANCO DE DADOS (SQLite)
============================= */

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "./database.sqlite",
  logging: false,
});

/* =============================
   MODELOS
============================= */

const Fornecedor = sequelize.define("Fornecedor", {
  nome: { type: DataTypes.STRING, allowNull: false },
  contato: { type: DataTypes.STRING },
  email: { type: DataTypes.STRING },
});

const Produto = sequelize.define("Produto", {
  nome: { type: DataTypes.STRING, allowNull: false },
  preco: { type: DataTypes.FLOAT, allowNull: false },
  descricao: { type: DataTypes.STRING },
  codigoBarras: { type: DataTypes.STRING },
});

/* =============================
   RELACIONAMENTO
============================= */

const Associacao = sequelize.define("Associacao", {});

Produto.belongsToMany(Fornecedor, { through: Associacao });
Fornecedor.belongsToMany(Produto, { through: Associacao });

/* =============================
   ROTAS PRODUTOS
============================= */

/* LISTAR */
app.get("/produtos", async (req, res) => {
  const produtos = await Produto.findAll();
  res.json(produtos);
});

/* CRIAR */
app.post("/produtos", async (req, res) => {
  try {
    const { nome, preco, descricao, codigoBarras } = req.body;

    if (!nome || !preco) {
      return res.status(400).json({
        error: "Nome e preço são obrigatórios",
      });
    }

    const produto = await Produto.create({
      nome,
      preco,
      descricao,
      codigoBarras,
    });

    res.status(201).json(produto);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/* EDITAR */
app.put("/produtos/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const produto = await Produto.findByPk(id);

    if (!produto) {
      return res.status(404).json({ error: "Produto não encontrado" });
    }

    await produto.update(req.body);

    res.json(produto);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/* REMOVER */
app.delete("/produtos/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const produto = await Produto.findByPk(id);

    if (!produto) {
      return res.status(404).json({ error: "Produto não encontrado" });
    }

    await produto.destroy();

    res.json({ message: "Produto removido com sucesso" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/* =============================
   ROTAS FORNECEDORES
============================= */

/* LISTAR */
app.get("/fornecedores", async (req, res) => {
  const fornecedores = await Fornecedor.findAll();
  res.json(fornecedores);
});

/* CRIAR */
app.post("/fornecedores", async (req, res) => {
  try {
    const fornecedor = await Fornecedor.create(req.body);
    res.status(201).json(fornecedor);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/* REMOVER */
app.delete("/fornecedores/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const fornecedor = await Fornecedor.findByPk(id);

    if (!fornecedor) {
      return res.status(404).json({ error: "Fornecedor não encontrado" });
    }

    await fornecedor.destroy();

    res.json({ message: "Fornecedor removido com sucesso" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/* =============================
   ROTA TESTE
============================= */

app.get("/", (req, res) => {
  res.send("API Moth Piercing funcionando 🦇");
});

/* =============================
   INICIAR SERVIDOR
============================= */

const PORT = process.env.PORT || 5000;

sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
  });
});