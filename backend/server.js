const express = require('express');
const cors = require('cors');
const routes = require('./routes/localizacao.routes.js');
const db = require('./config/db.config.js');
const path = require('path');  // Importa o módulo path do Node.js

const app = express();
const PORT = process.env.PORT || 4000;

const Localizacao = db.sequelize.models.Localizacao;


// Middlewares
app.use(cors());
app.use(express.json()); // substitui body-parser
app.use('/img', express.static(path.join(__dirname, '../frontend/src/img')));

// Serve arquivos estáticos da pasta 'frontend' (caminho absoluto)
app.use(express.static(path.join(__dirname, '../frontend')));

// Rotas
app.post('/localizacoes', async (req, res) => {
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  const { latitude, longitude } = req.body;

  // Pega apenas o primeiro IP (o mais relevante, único da máquina)
  const ipUnico = ip.split(',')[0].trim();

  console.log('IP original:', ip); // Logs com todos os IPs
  console.log('IP único (usado para verificação):', ipUnico);

  console.log('Latitude:', latitude, 'Longitude:', longitude);

  try {
   // Verifica se já existe uma localização registrada para o IP único
    let localizacaoExistente = await Localizacao.findOne({ where: { ip: ipUnico } });

    if (localizacaoExistente) {
      // Atualiza a localização existente
      await localizacaoExistente.update({
        latitude,
        longitude
      });

      res.status(200).json({ message: 'Localização atualizada com sucesso!', localizacao: localizacaoExistente });
    } else {
      // Cria uma nova localização
      const novaLocalizacao = await Localizacao.create({
        ip,
        latitude,
        longitude
      });

      res.status(200).json({ message: 'Localização criada com sucesso!', localizacao: novaLocalizacao });
    }
  } catch (error) {
    console.error('Erro ao salvar localização:', error);
    res.status(500).json({ message: 'Erro ao salvar localização.' });
  }
});


// Rota para página principal: retorna o index.html do frontend
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});


// Função para iniciar o servidor
const startServer = async () => {
  try {
    await db.sequelize.authenticate();
    console.log('✅ Conexão com o banco de dados foi bem-sucedida!');

    await db.sequelize.sync(); // { alter: true } ou { force: true } se desejar
    console.log('✅ Banco de dados sincronizado.');

    app.listen(PORT, () => {
      console.log(`🚀 Servidor rodando na porta ${PORT}`);
    });
  } catch (error) {
    console.error('❌ Erro ao iniciar o servidor:', error);
    process.exit(1); // importante para o Heroku entender que falhou
  }
};

startServer();
