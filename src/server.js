// Dentro do seu arquivo principal do back-end
const { Produto, Fornecedor } = require('./models'); // Verifique os nomes dos seus modelos

sequelize.sync({ force: false }).then(async () => {
  console.log('Banco de dados sincronizado! ⚖️');

  // Verifica se já existem dados para não duplicar toda vez que o Render reiniciar
  const countProdutos = await Produto.count();

  if (countProdutos === 0) {
    // 1. Criando Fornecedores Iniciais
    const forn1 = await Fornecedor.create({ nome: 'Metal Gothic Atacado', contato: '(85) 9999-0001' });
    const forn2 = await Fornecedor.create({ nome: 'Titânio Brasil Corp', contato: 'contato@titanio.com.br' });

    // 2. Criando Produtos Iniciais (Estilo Moth Piercing)
    await Produto.create({ 
        nome: 'Ebook Curso Ads', 
        preco: 45.90, 
        fornecedorId: forn1.id // Já vincula ao fornecedor 1
    });
    await Produto.create({ 
        nome: 'Ebook Curso SEO', 
        preco: 89.00, 
        fornecedorId: forn2.id 
    });
    await Produto.create({ 
        nome: 'Ebook Curso Copywriting', 
        preco: 35.00, 
        fornecedorId: forn1.id 
    });

    console.log('Carga inicial realizada com sucesso! 🧛');
  }
});