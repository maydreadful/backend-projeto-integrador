const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');

require('./models/ProdutoFornecedor');

const produtoRoutes = require('./routes/produtoRoutes');
const fornecedorRoutes = require('./routes/fornecedorRoutes');
const associacaoRoutes = require('./routes/associacaoRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/produtos', produtoRoutes);
app.use('/fornecedores', fornecedorRoutes);
app.use('/associacoes', associacaoRoutes);

sequelize.sync().then(() => {
  app.listen(3001, () => {
    console.log("Servidor rodando na porta 3001 🚀");
  });
});