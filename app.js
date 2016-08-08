'use strict'
require('dotenv').config();

const PORT = process.env.PORT || 8000;

const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser'); 
const Student = require('./models/student');
const students = require('./routes/students');

const app = express();

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.set('view engine', 'pug');
app.set('views','./views');

app.use(express.static('public'));

app.use('/', students);



app.get('/',(req, res, next)=>{
  Student.getAll(function(err, data){
    res.render('index', {title: "Message Board App", data});
  });
});


app.listen(PORT, err=>{
  console.log(err || `Server listening on port ${PORT}`);
});