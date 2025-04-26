const express = require('express');
const router = express.Router();
const localizacaoController = require('../controller/localizacao.controller.js');

router.post('/', localizacaoController.salvarLocalizacao);

module.exports = router;
