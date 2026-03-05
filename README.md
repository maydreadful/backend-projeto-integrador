📌 Descrição

FACULDADE GRAN (https://faculdade.grancursosonline.com.br/)

Projeto Disciplina Projeto Integrador

Link backend: https://backend-projeto-integrador-s6n2.onrender.com
Repositório FRONT END: https://github.com/maydreadful/frontend-projeto-integrador

Este projeto consiste no desenvolvimento de uma API REST para gerenciamento de:

Produtos

Fornecedores

Associação entre Produtos e Fornecedores (relação muitos-para-muitos)

A aplicação permite realizar operações de CRUD (Create, Read, Update, Delete) e gerenciar a associação entre produtos e seus respectivos fornecedores.

🛠 Tecnologias Utilizadas

Node.js

Express

Sequelize (ORM)

SQLite

Nodemon

CORS
backend-projeto-integrador/
│
├── src/
│   ├── config/
│   │    └── database.js
│   │
│   ├── controllers/
│   │    ├── produtoController.js
│   │    ├── fornecedorController.js
│   │    └── associacaoController.js
│   │
│   ├── models/
│   │    ├── Produto.js
│   │    ├── Fornecedor.js
│   │    └── ProdutoFornecedor.js
│   │
│   ├── routes/
│   │    ├── produtoRoutes.js
│   │    ├── fornecedorRoutes.js
│   │    └── associacaoRoutes.js
│   │
│   └── server.js
│
├── package.json
└── package-lock.json

🚀 Como Executar o Projeto
1️⃣ Clonar o repositório
git clone <url-do-repositorio>
2️⃣ Entrar na pasta do projeto
cd backend-projeto-integrador
3️⃣ Instalar as dependências
npm install
4️⃣ Rodar o servidor em modo desenvolvimento
npm run dev

Servidor disponível em:

http://localhost:3001
