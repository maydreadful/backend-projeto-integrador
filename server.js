const express = require('express');
const cors = require('cors'); //
const fs = require('fs');
const path = require('path');
const { Sequelize, DataTypes } = require('sequelize');

const app = express();

// 1. CONFIGURAÇÃO DE ACESSO (Obrigatório para Vercel -> Render)
app.use(cors()); 
app.use(express.json());

// 2. BANCO DE DADOS (SQLite)
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './database.sqlite',
    logging: false
});

// 3. MODELOS
const Fornecedor = sequelize.define('Fornecedor', {
    nome: { type: DataTypes.STRING, allowNull: false },
    contato: { type: DataTypes.STRING },
    email: { type: DataTypes.STRING }
});

const Produto = sequelize.define('Produto', {
    nome: { type: DataTypes.STRING, allowNull: false },
    preco: { type: DataTypes.FLOAT, allowNull: false },
    descricao: { type: DataTypes.STRING },
    codigoBarras: { type: DataTypes.STRING }
});

// Relacionamento N:N
const Associacao = sequelize.define('Associacao', {});
Produto.belongsToMany(Fornecedor, { through: Associacao });
Fornecedor.belongsToMany(Produto, { through: Associacao });

// 4. ROTAS DE CADASTRO (O que faltava para o botão funcionar!)
app.post('/produtos', async (req, res) => {
    try {
        const item = await Produto.create(req.body);
        res.status(201).json(item);
    } catch (e) { res.status(400).json({ error: e.message }); }
});

app.post('/fornecedores', async (req, res) => {
    try {
        const item = await Fornecedor.create(req.body);
        res.status(201).json(item);
    } catch (e) { res.status(400).json({ error: e.message }); }
});

// 5. ROTAS DE LISTAGEM
app.get('/produtos', async (req, res) => res.json(await Produto.findAll()));
app.get('/fornecedores', async (req, res) => res.json(await Fornecedor.findAll()));

// 6. INICIALIZAÇÃO
const PORT = process.env.PORT || 3000;
sequelize.sync().then(() => {
    app.listen(PORT, () => console.log(`Servidor Moth Piercing na porta ${PORT} 🚀`));
});