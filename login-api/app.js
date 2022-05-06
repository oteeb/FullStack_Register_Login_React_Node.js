var express = require('express')
var cors = require('cors')
var app = express()
var bodyParser = require('body-parser')
var jsonParser = bodyParser.json()
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const saltRounds = 10;
var jwt = require('jsonwebtoken');
const secret = 'Fullstack-Login';
const { body, validationResult } = require('express-validator');

app.use(cors())

// MySQL Connection
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'register_login',
  //port: '8889'
})


app.post('/register', jsonParser, function(req, res, next){

  const { email, fname, lname, password, cfpassword } = req.body;
  //console.log(cfpassword);
  if(cfpassword == password){
    
    var sql = 'select * from users where email = ?;';

    connection.query(sql,[email], function(err, result, fields){
      
      if(err) throw err;
      
      if(result.length > 0){
        return res.json({status: "errorremail", message: 'มี email นี้อยู่แล้ว',err});
      }else{
        var hashpassword = bcrypt.hashSync(password, 10);
        var sql = 'INSERT INTO users(email, password, fname, lname) VALUES(?, ?, ?, ?);';

        connection.query(sql,[email, hashpassword, fname, lname ], function(err, result, fields){
          if (err) {
              console.log("ไม่สามารถเพิ่มข้อมูลได้", err);
              return res.json({status: "errorr", message: 'ไม่สามารถเพิ่มข้อมูล Users ได้',err});
              //return res.status(400).send();
          }
          if(!(email && password && fname && lname && cfpassword)){
              return res.json({status: "error", message: 'กรุณากรอก Users ให้ครบทั้งหมด'});
            }
            
            return res.status(201).json({status: "ok", message: "เพิ่มข้อมูลได้สำเร็จ"});
        });
      }
    });
  }else{
    return res.json({status: "error", message: 'Password ไม่ตรงกัน'});
  }
});


/*app.post('/register', jsonParser,  function (req, res, next) {

  const { email, password, fname, lname, cfpassword } = req.body;
  //console.log(email);
  
  bcrypt.hash(password, saltRounds, function(err, hash) {
    try {
      connection.query(
          "INSERT INTO users(email, password, fname, lname) VALUES(?, ?, ?, ?)",
          [email, hash, fname, lname],
          (err, results, fields) => {
              if (err) {
                  console.log("ไม่สามารถเพิ่มข้อมูลได้", err);
                  return res.json({status: "errorr", message: 'ไม่สามารถเพิ่มข้อมูล Users ได้',err});
                  //return res.status(400).send();
              }
              if(!(email && password && fname && lname && cfpassword)){
                return res.json({status: "error", message: 'กรุณากรอก Users ให้ครบทั้งหมด'});
              }
              
              return res.status(201).json({status: "ok", message: "เพิ่มข้อมูลได้สำเร็จ"});
              
          }
      )
  } 
  catch(err) {
      console.log(err);
      return res.status(500).send();
  }
  });
})*/

app.post('/login', jsonParser, function (req, res, next) {
  
    try {
        connection.query("SELECT * FROM users WHERE email = ?", [req.body.email], (err, users, fields) => {
            if (err) {
                return res.json({status: "error", message: err});
            }if(users.length == 0){
                console.log("ไม่พบข้อมูล Users", err);
                return res.json({status: "error", message: 'ไม่พบข้อมูล Users',err});
                //return res.status(400).send();
            }
            bcrypt.compare(req.body.password, users[0].password, function(err, isLogin) {
              if(isLogin){
                var token = jwt.sign({ email: users[0].email }, secret, { expiresIn: '1h' });
                return res.json({status: "ok", message: 'login สำเร็จ', token});
              }else{
                return res.json({status: "error", message: 'login ไม่สำเร็จ'});
              }
            });
            
        })
    } catch(err) {
        console.log(err);
        return res.status(500).send();
    }

})


app.post('/authen', jsonParser, function (req, res, next) {


      try {
        const token = req.headers.authorization.split(' ')[1]
        var decoded = jwt.verify(token, secret);
        return res.status(201).json({status: "ok", message: "Token พร้อมแล้ว ", decoded});
      }
        catch(err) {
        return res.status(400).json({status: "error", message: "Token เกิดข้อผิดพลาด", err});
        
      }

})


app.listen(3333, function () {
  console.log('รันเซิฟเวอร์ on port 3333')
})