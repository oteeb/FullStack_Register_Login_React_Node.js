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

app.use(cors())

// MySQL Connection
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'register_login',
  //port: '8889'
})

app.post('/register', jsonParser, function (req, res, next) {
  const { email, password, fname, lname } = req.body;

  bcrypt.hash(password, saltRounds, function(err, hash) {
    try {
      connection.query(
          "INSERT INTO users(email, password, fname, lname) VALUES(?, ?, ?, ?)",
          [email, hash, fname, lname],
          (err, results, fields) => {
              if (err) {
                  console.log("ไม่สามารถเพิ่มข้อมูลได้", err);
                  return res.status(400).send();
              }
              return res.status(201).json({ message: "เพิ่มข้อมูลได้สำเร็จ"});
          }
      )
  } catch(err) {
      console.log(err);
      return res.status(500).send();
  }
  });
})

app.post('/login', jsonParser, function (req, res, next) {
    try {
        connection.query("SELECT * FROM users WHERE email = ?", [req.body.email], (err, users, fields) => {
            if (err) {
                console.log(err);
                return res.status(400).send();
            }if(users.length == 0){
                console.log("ไม่พบข้อมูล Users", err);
                return res.status(400).send();
            }
            bcrypt.compare(req.body.password, users[0].password, function(err, isLogin) {
              if(isLogin){
                var token = jwt.sign({ email: users[0].email }, secret, { expiresIn: '1h' });
                return res.status(201).json({ message: "Login สำเร็จ", token});
              }else{
                return res.status(400).json({ message: "Login ไม่สำเร็จ"});
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
        return res.status(201).json({ message: "Token สำเร็จ", decoded});
      }
        catch(err) {
        return res.status(400).json({ message: "Token เกิดข้อผิดพลาด", err});
        
      }

})


app.listen(3333, function () {
  console.log('CORS-enabled web server listening on port 3333')
})