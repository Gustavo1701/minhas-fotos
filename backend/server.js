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

// Serve arquivos estáticos da pasta 'frontend' (caminho absoluto)
app.use(express.static(path.join(__dirname, '../frontend')));

// Rotas
app.post('/localizacoes', async (req, res) => {
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  const { latitude, longitude } = req.body;

  console.log('IP recebido no backend:', ip);
  console.log('Latitude:', latitude, 'Longitude:', longitude);

  try {
    const novaLocalizacao = await Localizacao.create({
      ip: ip,
      latitude: latitude,
      longitude: longitude
    });

    res.status(200).json({ message: 'Localização salva com sucesso!', localizacao: novaLocalizacao });
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
