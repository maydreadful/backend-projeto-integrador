// Dentro do seu arquivo principal do back-end
const express = require('express');
const cors = require('cors'); // Importa a permissão
const app = express();

// Esta linha libera o acesso para QUALQUER site consumir sua API
app.use(cors()); 

app.use(express.json());

const { Produto, Fornecedor } = require('./models'); // Verifique os nomes dos seus modelos

sequelize.sync({ force: false }).then(async () => {
  console.log('Banco de dados sincronizado! ⚖️');

  // Verifica se já existem dados para não duplicar toda vez que o Render reiniciar
  const countProdutos = await Produto.count();

  if (countProdutos === 0) {

    // 2. Criando Produtos Iniciais (Estilo Moth Piercing)
    await Produto.create({ 
    });

    console.log('Carga inicial realizada com sucesso! 🧛');
  }
});