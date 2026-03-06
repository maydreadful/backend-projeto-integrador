const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { Sequelize, DataTypes } = require('sequelize');

const app = express();

// 1. CONFIGURAÇÃO DO CORS (Resolve o erro da image_9819a8.png)
app.use(cors({
    origin: '*', // Em produção, você pode trocar '*' pela sua URL da Vercel
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type']
}));

app.use(express.json());

// 2. CONFIGURAÇÃO DO BANCO DE DADOS (SQLite)
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './database.sqlite',
    logging: false
});

// 3. DEFINIÇÃO DOS MODELOS (Moth Piercing Style)
const Fornecedor = sequelize.define('Fornecedor', {
    nome: { type: DataTypes.STRING, allowNull: false },
    contato: { type: DataTypes.STRING },
    email: { type: DataTypes.STRING }
});

const Produto = sequelize.define('Produto', {
    nome: { type: DataTypes.STRING, allowNull: false },
    preco: { type: DataTypes.FLOAT, allowNull: false },
    descricao: { type: DataTypes.STRING }
});

// Relacionamento N:N (Muitos-para-Muitos)
const Associacao = sequelize.define('Associacao', {});
Produto.belongsToMany(Fornecedor, { through: Associacao });
Fornecedor.belongsToMany(Produto, { through: Associacao });

// 4. LÓGICA DE CARGA INICIAL (SEEDING) DO DATABASE.JSON
async function carregarDadosIniciais() {
    try {
        const totalProdutos = await Produto.count();
        
        if (totalProdutos === 0) {
            console.log("Iniciando carga de dados da Moth Piercing... 🧛");
            
            const dataPath = path.join(__dirname, 'database.json');
            if (fs.existsSync(dataPath)) {
                const rawData = fs.readFileSync(dataPath, 'utf8');
                const seedData = JSON.parse(rawData);

                // Cadastra Fornecedores
                const fornecedoresCriados = await Fornecedor.bulkCreate(seedData.fornecedores);
                
                // Cadastra Produtos
                const produtosCriados = await Produto.bulkCreate(seedData.produtos);

                // Cria um vínculo inicial N:N para teste
                if (produtosCriados.length > 0 && fornecedoresCriados.length > 0) {
                    await produtosCriados[0].addFornecedor(fornecedoresCriados[0]);
                }

                console.log("Banco de dados populado com sucesso! ⚖️");
            }
        }
    } catch (error) {
        console.error("Erro ao carregar dados iniciais:", error);
    }
}

// 5. ROTAS DA API
app.get('/produtos', async (req, res) => {
    const produtos = await Produto.findAll();
    res.json(produtos);
});

app.get('/fornecedores', async (req, res) => {
    const fornecedores = await Fornecedor.findAll();
    res.json(fornecedores);
});

app.get('/associacoes', async (req, res) => {
    const associacoes = await Produto.findAll({
        include: Fornecedor
    });
    // Formata os dados para o seu Relatório Front-end
    const formatado = associacoes.flatMap(p => 
        p.Fornecedors.map(f => ({
            Produto: { nome: p.nome, preco: p.preco },
            Fornecedor: { nome: f.nome, contato: f.contato }
        }))
    );
    res.json(formatado);
});

// Rota para criar vínculo N:N
app.post('/vincular', async (req, res) => {
    const { produtoId, fornecedorId } = req.body;
    const produto = await Produto.findByPk(produtoId);
    const fornecedor = await Fornecedor.findByPk(fornecedorId);
    
    if (produto && fornecedor) {
        await produto.addFornecedor(fornecedor);
        return res.json({ message: "Vínculo criado com sucesso!" });
    }
    res.status(404).json({ error: "Produto ou Fornecedor não encontrado" });
});

// 6. INICIALIZAÇÃO DO SERVIDOR
const PORT = process.env.PORT || 3000;
sequelize.sync().then(() => {
    carregarDadosIniciais();
    app.listen(PORT, () => {
        console.log(`Servidor Moth Piercing rodando na porta ${PORT} 🚀`);
    });
});