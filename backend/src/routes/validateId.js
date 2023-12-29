// validateId.js

const crypto = require('crypto');

function isValidPersonId(personId) {
  // Recupere o seed a partir de um local seguro.
  const seed = 'SEU_SEED_AQUI'; // Substitua pelo seu seed real.

  // Gere o SHA-256 hash do seed.
  const seedHash = crypto.createHash('sha256').update(seed).digest('hex');

  // Compare o hash gerado com o ID da pessoa fornecido.
  return seedHash === personId;
}

module.exports = isValidPersonId;
