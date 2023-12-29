const router = require('express').Router();
const db = require("../config/database")

const colName = "person"

// Função para gerar o personId usando o seed.
async function generatePersonId() {
    // Recupere o seed da coleção "config".
    const configCollection = db.collection('config');
    const personSeedDocument = await configCollection.document('PersonSeed');
  
    // Verifique se o documento "PersonSeed" existe.
    if (!personSeedDocument) {
      // Se o documento "PersonSeed" não existe, crie-o.
      insertPersonSeed();
      // Após criar o documento, recupere-o novamente.
      personSeedDocument = await configCollection.document('PersonSeed');
    }
  
    // Obtenha o seed do documento "PersonSeed".
    const seed = personSeedDocument.seed;
  
    // Gere um SHA-256 hash do seed.
    const hash = crypto.createHash('sha256').update(seed).digest('hex');
  
    // Use o hash como o personId.
    return hash;
  }
  
  // Função para inserir o documento "PersonSeed" na coleção "config".
  async function insertPersonSeed() {
    const seed = crypto.randomBytes(32).toString('hex');
    const personSeedDocument = {
      _key: '1',
      seed: seed,
    };
    
    const configCollection = db.collection('config');
  
    try {
      // Insira o documento na coleção "config".
      await configCollection.save(personSeedDocument);
      console.log('Documento "PersonSeed" inserido com sucesso.');
    } catch (error) {
      console.error('Erro ao inserir o documento "PersonSeed":', error);
    }
  }


router.post('/', async (req, res) => {
  try {
    const data = req.body;
    // Gere o personId usando a função generatePersonId.
    const personId = await generatePersonId();
    // Adicione o personId aos dados da pessoa.
    data.personId = personId;

    const cursor = await db.query(`insert @data in ${colName} let n = NEW return n`, { "data": data });
    res.status(200).send(cursor.next());
  } catch (error) {
    res.status(500).send(error.message);
  }
});
 
router.put('/', async (req, res) => {
    
    let data = req.body;

    let result = await db.query(`update @data with @data in ${colName} let n = NEW return n`,{"data":data})
    result = await result.all();

    res.status(200).send(result[0]);
})

router.get('/', async (req, res) => {

    const cursor = await db.query(`
        for c in ${colName} return c`)

    res.status(200).send(await cursor.all());
        
})


router.get('/:_key', async (req, res) => {

    const _key = req.params._key;

    const cursor = await db.query(`
        for c in ${colName} filter c._key == @_key return c`,{_key:_key})

    const result = await cursor.next();

    res.status(200).send(result);
        
})



module.exports = router;