require('dotenv').config({ path: __dirname + '/.env' });

const collectionConfig = [
    {name:"person", type: 1},
    {name:"tag", type: 1},
    {name:"config", type: 1},
    {name:"user", type: 1},
    {name:"process", type: 1},
];

module.exports = collectionConfig;