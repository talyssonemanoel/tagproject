const router = require('express').Router();
const db = require("../config/database")
const fs = require('fs');
const util = require('util');
const readFile = util.promisify(fs.readFile);
const { aql } = require('arangojs');


const colName = "Document"


router.get('/', async (req, res) => {

  const cursor = await db.query(`
        for c in ${colName} return c`)

  res.status(200).send(await cursor.all());

})

router.get('/:_key', async (req, res) => {

  const _key = req.params._key;

  const cursor = await db.query(`
        for c in ${colName} filter c._key == @_key return c`, { _key: _key })

  const result = await cursor.next();

  res.status(200).send(result);

})

router.get('/getSignedDocument/:_key', async (req, res) => {

  const _key = req.params._key;
  
  const cursor = await db.query(`
        for c in ${colName} filter c._key == @_key return c.signed`, { _key: _key })

  const result = await cursor.next();

  res.status(200).send({result});

})

router.put('/sign-doc/:_key', async (req, res) => {
  const _key = req.params._key;
  const collection = db.collection(colName);

  try {
      await collection.update(_key, { signed: true });
      res.status(200).send({ message: 'Documento assinado com sucesso.' });
  } catch (error) {
      console.error(error);
      res.status(500).send({ error: 'Ocorreu um erro ao tentar assinar o documento.' });
  }
});

module.exports = router;
