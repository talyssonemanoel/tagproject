const router = require('express').Router();
const db = require("../config/database")

const colName = "user"

router.post('/', async (req, res) => {
  try {
    const { _super, name } = req.body

    const tag = {
      _super,
      name
    }
    const cursor = await db.query(`insert @data in ${colName} let n = NEW return n`, { "data": tag });
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

router.get('/name', async (req, res) => {

  const name = req.query.name;

  const cursor = await db.query(`
  for doc in ${colName}
      LET name = CONCAT_SEPARATOR(" ", TOKENS(doc.name, "text_de"))
      LET name_ = CONCAT_SEPARATOR(" ", TOKENS(@name, "text_de"))
      filter contains(name,name_)

      RETURN doc
      `,{name:name})

  const result = await cursor.all();

  res.status(200).send(result);
      
})


router.get('/:_key', async (req, res) => {

    const _key = req.params._key;

    const cursor = await db.query(`
        for c in ${colName} filter c._key == @_key return c`,{_key:_key})

    const result = await cursor.next();

    res.status(200).send(result);
        
})

//rota para retornar tags em que o usuário está associado
router.get('/tags/:_key', async (req, res) => {
  try {
    const _key = req.params._key;

    // Consulta para obter as tags associadas ao usuário com a chave fornecida
    const query = `
      FOR doc IN ${colName}
        FILTER doc._key == @key
        RETURN doc.listTag
    `;
    const cursor = await db.query(query, { key: _key });
    
    const result = await cursor.all();

    if (result.length > 0) {
      res.status(200).send(result[0]);
    } else {
      res.status(404).send({ error: 'Usuário não encontrado' });
    }
  } catch (error) {
    console.error('Erro ao obter tags:', error);
    res.status(500).send({ error: 'Erro interno do servidor' });
  }
});

// Rota para buscar tags hierarquicamente superiores
router.get('/tags/:key/superiors', async (req, res) => {
  const key = req.params.key;
  
  try {
    // Chama a função recursiva para obter as tags superiores
    const superiors = await getSuperiorTags(key);
    res.json({ superiors });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao buscar tags superiores.' });
  }
});

router.get('/inbox', async (req, res) => {
  const role = req.params.body.role;
  
  if (role == 'strategic' || 'tatic') {

  }
  
  try {
    // Chama a função recursiva para obter as tags superiores
    const superiors = await getSuperiorTags(key);
    res.json({ superiors });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao buscar tags superiores.' });
  }
});

// Função recursiva para obter as tags superiores hierarquicamente
async function getSuperiorTags(key, superiors = []) {
  // Busca o documento da tag com a chave fornecida
  const tag = await db.collection('tag').document(key);

  // Se a tag existir, adiciona à lista de superiores e continua a busca recursiva
  if (tag) {
    superiors.push(tag);

    // Se a tag tiver um atributo 'super', chama a função recursivamente para a tag superior
    if (tag._super) {
      return getSuperiorTags(tag._super, superiors);
    }
  }

  return superiors;
}

router.put('/add-tag/:_key', async (req, res) => {

  let tag = req.body;
  
  let result = await db.query(`
    LET doc = DOCUMENT(${colName}, @_key)
    UPDATE doc WITH { listTag: PUSH(doc.listTag, @tag) } IN ${colName}
    LET n = NEW 
    RETURN n
  `, { _key: req.params._key, tag: tag });

  result = await result.all();

  res.status(200).send(result[0]);
})

router.put('/:_keyUser/tag/:_keyTag', async (req, res) => {
  
  let _keyUser = req.params._keyUser;
  let _keyTag = req.params._keyTag;

  let result = await db.query(`
    LET doc = DOCUMENT(${colName}, @_keyUser)
    LET updatedListTag = (
      FOR tag IN doc.listTag
      FILTER tag._key != @_keyTag
      RETURN tag
    )
    UPDATE doc WITH { listTag: updatedListTag } IN ${colName}
    LET n = NEW 
    RETURN n
  `, { _keyUser: _keyUser, _keyTag: _keyTag });

  result = await result.all();

  res.status(200).send(result[0]);
})


// Rota para buscar todas as tags que têm uma chave específica como 'super'
router.get('/tags/:key/subordinates', async (req, res) => {
  const key = req.params.key;

  try {
    // Chama a função para obter todas as tags subordinadas
    const subordinates = await getSubordinateTags(key);
    res.json({ subordinates });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao buscar tags subordinadas.' });
  }
});

// Função para obter todas as tags subordinadas hierarquicamente
async function getSubordinateTags(key, subordinates = []) {
  // Busca todos os documentos da coleção 'tag' que têm a chave fornecida como 'super'
  const cursor = await db.query({
    query: `
      FOR tag IN tag
      FILTER tag._super == @key
      RETURN tag
    `,
    bindVars: { key },
  });

  // Itera sobre o cursor e adiciona as tags à lista de subordinadas
  await cursor.each((tag) => {
    subordinates.push(tag);
  });

  return subordinates;
}

module.exports = router;
