require('dotenv').config();
const express = require('express');
const fileUpload = require('express-fileupload');


const path = require('path');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');

const tag = require('./src/routes/tag')
const user = require('./src/routes/user')
const process = require('./src/routes/process')
const document = require('./src/routes/document')
const dashboard = require('./src/routes/dashboard')

const app = express();

app.use(fileUpload());
app.use(helmet());
app.use(cors({origin: 'http://localhost:3003', 
credentials: true}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(morgan('dev'));

app.use('/tag', tag);
app.use('/user', user);
app.use('/process', process);
app.use('/document', document);
app.use('/dashboard',dashboard);


app.listen(3001,()=>{
    console.log('listening...',3001);
})

