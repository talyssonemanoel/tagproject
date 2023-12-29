// testIds.js

const generatePersonId = require('./generateId');
const isValidPersonId = require('./validateId');

// Teste a geração de IDs.
const personId = generatePersonId();
console.log('Person ID:', personId);

// Teste a validação do ID gerado.
const isValid = isValidPersonId(personId);

if (isValid) {
  console.log('O ID da pessoa é válido.');
} else {
  console.log('O ID da pessoa não é válido.');
}
