const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { Sequelize, DataTypes } = require('sequelize');

const app = express();

// 1. CONFIGURAÇÃO DO CORS (Liberação total para Vercel e Render)
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type']
}));

app.use(express.json());

// 2. CONFIGURAÇÃO DO BANCO DE DADOS
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './database.sqlite',
    logging: false
});

// 3. DEFINIÇÃO DOS MODELOS (Ajustados para bater com seu front-end)
const Fornecedor = sequelize.define('Fornecedor', {
    nome: { type: DataTypes.STRING, allowNull: false },
    contato: { type: DataTypes.STRING },
    email: { type: DataTypes.STRING }
});

const Produto = sequelize.define('Produto', {
    nome: { type: DataTypes.STRING, allowNull: false },
    preco: { type: DataTypes.FLOAT, allowNull: false },
    descricao: { type: DataTypes.STRING },
    codigoBarras: { type: DataTypes.STRING } // Adicionado para evitar erros de campo faltando
});

const Associacao = sequelize.define('Associacao', {});
Produto.belongsToMany(Fornecedor, { through: Associacao });
Fornecedor.belongsToMany(Produto, { through: Associacao });

// 4. LÓGICA DE CARGA INICIAL
async function carregarDadosIniciais() {
    try {
        const totalProdutos = await Produto.count();
        if (totalProdutos === 0) {
            console.log("Iniciando carga de dados da Moth Piercing... 🧛");
            const dataPath = path.join(__dirname, 'database.json');
            if (fs.existsSync(dataPath)) {
                const seedData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
                const fornecedoresCriados = await Fornecedor.bulkCreate(seedData.fornecedores);
                const produtosCriados = await Produto.bulkCreate(seedData.produtos);
                console.log("Banco de dados populado com sucesso! ⚖️");
            }
        }
    } catch (error) {
        console.error("Erro ao carregar dados iniciais:", error);
    }
}

// 5. ROTAS DA API (Leitura)
app.get('/produtos', async (req, res) => {
    const produtos = await Produto.findAll();
    res.json(produtos);
});

app.get('/fornecedores', async (req, res) => {
    const fornecedores = await Fornecedor.findAll();
    res.json(fornecedores);
});

// 6. ROTAS DE CADASTRO (O que estava faltando!)
app.post('/produtos', async (req, res) => {
    try {
        const novoProduto = await Produto.create(req.body);
        res.status(201).json(novoProduto);
    } catch (error) {
        res.status(400).json({ error: "Erro ao cadastrar produto" });
    }
});

app.post('/fornecedores', async (req, res) => {
    try {
        const novoFornecedor = await Fornecedor.create(req.body);
        res.status(201).json(novoFornecedor);
    } catch (error) {
        res.status(400).json({ error: "Erro ao cadastrar fornecedor" });
    }
});

app.get('/associacoes', async (req, res) => {
    const associacoes = await Produto.findAll({ include: Fornecedor });
    const formatado = associacoes.flatMap(p => 
        (p.Fornecedors || []).map(f => ({
            Produto: { nome: p.nome, preco: p.preco },
            Fornecedor: { nome: f.nome, contato: f.contato }
        }))
    );
    res.json(formatado);
});

app.post('/vincular', async (req, res) => {
    const { produtoId, fornecedorId } = req.body;
    const produto = await Produto.findByPk(produtoId);
    const fornecedor = await Fornecedor.findByPk(fornecedorId);
    if (produto && fornecedor) {
        await produto.addFornecedor(fornecedor);
        return res.json({ message: "Vínculo criado com sucesso!" });
    }
    res.status(404).json({ error: "Item não encontrado" });
});

// 7. INICIALIZAÇÃO
const PORT = process.env.PORT || 3000;
sequelize.sync().then(() => {
    carregarDadosIniciais();
    app.listen(PORT, () => {
        console.log(`Servidor Moth Piercing rodando na porta ${PORT} 🚀`);
    });
});