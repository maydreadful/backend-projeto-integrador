const express = require('express');
const router = express.Router();
const controller = require('../controllers/associacaoController');

router.post('/', controller.associar);
router.get('/fornecedor/:id', controller.listarProdutosDoFornecedor);

module.exports = router;