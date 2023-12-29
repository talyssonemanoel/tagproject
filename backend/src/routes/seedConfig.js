const db = require("../config/database")
const crypto = require('crypto');

// Gerar o seed usando a mesma lógica que você mencionou.
const seed = crypto.randomBytes(32).toString('hex');

// Defina o documento "PersonSeed" com o atributo "seed".
const personSeedDocument = {
  _key: '1', // Substitua com a chave desejada.
  seed: seed
};

// Acesse a coleção "config" e insira o documento "PersonSeed".
const configCollection = db.collection('config');

async function insertPersonSeed() {
  try {
    // Insira o documento na coleção "config".
    await configCollection.save(personSeedDocument);
    console.log('Documento "PersonSeed" inserido com sucesso.');
  } catch (error) {
    console.error('Erro ao inserir o documento "PersonSeed":', error);
  }
}

insertPersonSeed();
