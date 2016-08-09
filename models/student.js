'use strict'
const squel = require('squel').useFlavour('mysql');
const uuid = require('uuid');
const connection = require('../config/db');

connection.query(`create table if not exists student(
  id varchar(50),
  name varchar(50),
  total int,
  score int)`, err=>{
    if(err){
      console.log('Table create error:', err);
    }
  });

exports.getAll = function(){
  return new Promise((resolve, reject)=>{
    let sql = squel.select()
                   .from('student')
                   .toString();
    connection.query(sql, function(err, students){
      if(err){
        reject(err);
      }else{
        students = students.map(student=>grade(student));
        resolve(students);
      }
    });
  });
};

exports.getOne = function(id) {
  return new Promise((resolve, reject) => {
    let sql = squel.select()
                   .from('student')
                   .where('id = ?', id)
                   .toString();

    connection.query(sql, (err, students) => {
      let student = students[0];

      if(err) {
        reject(err);
      } else if(!student) {
        reject({error: 'student not found.'})
      } else {
        student = grade(student);
        resolve(student);
      }
    });
  });
};

exports.create = function(newStudent){
  return new Promise((resolve, reject)=>{
    let sql = squel.insert()
                   .into('student')
                   .setFields(newStudent)
                   .set('id', uuid())
                   .toString();
    connection.query(sql, err=>{
      if(err){
        reject(err);
      }else{
        resolve();
      }
    });
  });
};

exports.update = function(id, updateObj) {
  return new Promise((resolve, reject) => {
    delete updateObj.id;

    let sql = squel.update()
                   .table('student')
                   .setFields(updateObj)
                   .where('id = ?', id)
                   .toString();

    connection.query(sql, (err, okObject) => {
      if(err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};


exports.delete = function(id){
  return new Promise((resolve, reject)=>{
    let sql = squel.delete()
                   .from('student')
                   .where('id = ?', id)
                   .toString();

    connection.query(sql, (err, result)=>{
      if(result.affectedRows === 0){
        reject({error: 'The student not found.'});
      }else if(err){
        reject(err);
      }else{
        resolve();
      }
    });
  });
};

exports.getTotals = function(){
  return exports.getAll()
                .then(students =>{
                  console.log('here in getTotals')
                  let total = students.reduce((obj, student)=>{
                    obj.total_possible += student.total;
                    obj.total_score += student.score;
                    if(obj.grade[student.grade]){
                      obj.grade[student.grade]++;
                    }else{
                      obj.grade[student.grade] = 1;
                    }
                    return obj;
                  },{
                    total_possible: 0,
                    total_score: 0,
                    grade: {}
                  });
                  return total;
                })
                .catch(err => {
                  console.log('err:', err);
                });
};



function grade(student){
  let grade = (student.score / student.total) * 100;
  let result
  if(grade >= 90){
    result = 'A';
  }else if(grade >=80){
    result = 'B';
  }else if(grade >=70){
    result = 'C';
  }else if(grade >=60){
    result = 'D';
  }else{
    result = 'F';
  }
  student.grade = result;
  return student;
}


