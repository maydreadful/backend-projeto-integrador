const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { Sequelize, DataTypes, Op } = require('sequelize');

const app = express();

// 1. CONFIGURAÇÕES DE ACESSO E PARSER
app.use(cors()); 
app.use(express.json());

// 2. CONEXÃO COM BANCO DE DATA (SQLite)
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './database.sqlite',
    logging: false
});

// 3. MODELOS RETIFICADOS (Sem CNPJ para agilizar o cadastro)
const Fornecedor = sequelize.define('Fornecedor', {
    nome: { type: DataTypes.STRING, allowNull: false },
    contato: { type: DataTypes.STRING },
    email: { type: DataTypes.STRING }
});

const Produto = sequelize.define('Produto', {
    nome: { type: DataTypes.STRING, allowNull: false },
    preco: { type: DataTypes.FLOAT, allowNull: false },
    descricao: { type: DataTypes.STRING },
    quantidade: { type: DataTypes.INTEGER, defaultValue: 10 } // NOVO CAMPO PARA ESTOQUE
});

// Relacionamento N:N
const Associacao = sequelize.define('Associacao', {});
Produto.belongsToMany(Fornecedor, { through: Associacao });
Fornecedor.belongsToMany(Produto, { through: Associacao });

// 4. ROTAS PADRÃO (GET / POST)
app.get('/produtos', async (req, res) => res.json(await Produto.findAll()));
app.get('/fornecedores', async (req, res) => res.json(await Fornecedor.findAll()));
app.post('/produtos', async (req, res) => res.status(201).json(await Produto.create(req.body)));
app.post('/fornecedores', async (req, res) => res.status(201).json(await Fornecedor.create(req.body)));

// ---------------------------------------------------------
// 🚀 NOVOS ENDPOINTS PARA O PROJETO DE EXTENSÃO
// ---------------------------------------------------------

// Endpoint 1: Alerta de Estoque Baixo (GET)
// Retorna materiais com menos de 5 unidades para evitar interrupção de serviços.
app.get('/estoque/baixo', async (req, res) => {
    const itens = await Produto.findAll({
        where: { quantidade: { [Op.lt]: 5 } }
    });
    res.json(itens);
});

// Endpoint 2: Baixa de Material por Serviço (PATCH)
// Deduz uma unidade do estoque ao realizar um piercing ou tattoo.
app.patch('/produtos/:id/saida', async (req, res) => {
    try {
        const produto = await Produto.findByPk(req.params.id);
        if (!produto) return res.status(404).json({ error: "Item não encontrado" });

        if (produto.quantidade > 0) {
            produto.quantidade -= 1;
            await produto.save();
            res.json({ message: "Baixa realizada!", estoque_atual: produto.quantidade });
        } else {
            res.status(400).json({ error: "Estoque zerado!" });
        }
    } catch (e) { res.status(500).json({ error: e.message }); }
});

// 5. INICIALIZAÇÃO E SEEDING
const PORT = process.env.PORT || 3000;

sequelize.sync().then(async () => {
    // Carga inicial se o banco estiver vazio
    const count = await Produto.count();
    if (count === 0 && fs.existsSync('./database.json')) {
        const dados = JSON.parse(fs.readFileSync('./database.json', 'utf-8'));
        await Produto.bulkCreate(dados.produtos);
        await Fornecedor.bulkCreate(dados.fornecedores);
        console.log("Banco populado com sucesso! 🧛");
    }
    
    app.listen(PORT, () => console.log(`Servidor Moth Piercing online na porta ${PORT} 🚀`));
});