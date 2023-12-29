// generateId.js

const crypto = require('crypto');

function generatePersonId() {
  // Recupere o seed a partir de um local seguro.
  const seed = 'SEU_SEED_AQUI'; // Substitua pelo seu seed real.

  // Gere um SHA-256 hash do seed.
  const hash = crypto.createHash('sha256').update(seed).digest('hex');

  // Retorne o hash como o ID da pessoa.
  return hash;
}

module.exports = generatePersonId;
