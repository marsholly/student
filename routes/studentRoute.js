"use strict";
const express = require('express');
const router = express.Router();
const Student = require('../models/student');

// /studentRoute
// studentRoute.js

router.get('/', (req, res)=>{
  Student.getAll()
   .then(students =>{
      console.log(students);
      res.send(students);
   })
   .catch(err=>{
      res.status(400).send(err);
   });
});

router.get('/totals', (req, res)=>{
  Student.getTotals()
     .then(obj =>{
        res.send(obj);
     })
     .catch(err=>{
        res.status(400).send(err);
     });
});


router.get('/:id', (req, res) => {
  Student.getOne(req.params.id)
    .then(student => {
      res.send(student);
    })
    .catch(err => {
      res.status(400).send(err);
    });
});

router.post('/', (req, res)=>{
  Student.create(req.body)
   .then(()=>{
      console.log('here!!!');
      res.send();
   })
   .catch(err=>{
      res.status(400).send(err);
   });
});

router.put('/:id', (req, res)=>{
  Student.update(req.params.id, req.body)
   .then(()=>{
      return Student.getOne(req.params.id);
   })
   .then(student=>{
      res.send(student);  
   })
   .catch(err=>{
      res.status(400).send(err);
   });
});

router.delete('/:id',(req, res)=>{
  Student.delete(req.params.id)
   .then(()=>{
      res.send();    
   })
   .catch(err=>{
      res.status(400).send(err);
   });
});




module.exports = router;










