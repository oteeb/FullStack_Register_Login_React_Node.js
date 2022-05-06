const express = require('express');
const path = require('path');
const cookieSession = require('cookie-session');
const bcrypt = require('bcrypt');
const dbConnection = require('./database');
const { body, validationResult } = require('express-validator');


// APPLY COOKIE SESSION MIDDLEWARE
app.use(cookieSession({
    name: 'session',
    keys: ['key1', 'key2'],
    maxAge:  3600 * 1000 // 1hr
}));

const ifLoggedin = (req,res,next) => {
    if(req.session.isLoggedIn){
        return res.redirect('/');
    }
    next();
}

app.post('/register', ifLoggedin, 

[
    body('email','Invalid email address!').isEmail().custom((value) => {
        return dbConnection.execute('SELECT `email` FROM `users` WHERE `email`=?', [value])
        .then(([rows]) => {
            if(rows.length > 0){
                return Promise.reject('This E-mail already in use!');
            }
            return true;
        });
    }),
],
(req,res,next) => {

    const validation_result = validationResult(req);
    const {email, password, fname, lname} = req.body;
    
    if(validation_result.isEmpty()){
        
        bcrypt.hash(password, 12).then((hash_pass) => {

            if(!(email && password && fname && lname)){
                return res.json({status: "error", message: 'กรุณากรอก Users ให้ครบทั้งหมด'});
              }
            
            connection.execute("INSERT INTO `users`(email, password, fname, lname) VALUES(?,?,?,?)",[email, hash_pass, fname, lname])
            .then(result => {
                return res.status(201).json({status: "ok", message: "เพิ่มข้อมูลได้สำเร็จ"});
            }).catch(err => {
                if (err) {
                    console.log("ไม่สามารถเพิ่มข้อมูลได้", err);
                  return res.json({status: "errorr", message: 'ไม่สามารถเพิ่มข้อมูล Users ได้',err});
                }
            });
        })
        .catch(err => { 
            if (err) throw err;
        })
    }
    else{
        let allErrors = validation_result.errors.map((error) => {
            return error.msg;
        });
        res.render('/',{
            register_error:allErrors,
            old_data:req.body
        });
    }
});