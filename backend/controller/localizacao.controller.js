const db = require('../config/db.config.js');
const Localizacao = db.Localizacao;

const salvarLocalizacao = async (req, res) => {
  const { ip, latitude, longitude } = req.body;

  try {
    await Localizacao.create({ ip, latitude, longitude });
    return res.status(201).json({ message: 'Localização salva com sucesso' });
  } catch (error) {
    console.error('Erro ao salvar localização:', error);
    return res.status(500).json({ message: 'Erro interno no servidor' });
  }
};

module.exports = { salvarLocalizacao };
