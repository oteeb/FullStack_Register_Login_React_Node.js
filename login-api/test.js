
app.post('/register', jsonParser, function(req, res, next){

    const { email, password, fname, lname, cfpassword } = req.body;
  
    if(cfpassword == password){
  
      var sql = 'select * from users where email = ?;';
  
      connection.query(sql,[email], function(err, result, fields){
        if(err) throw err;
  
        if(result.length > 0){
          req.session.flag = 1;
          res.redirect('/');
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
        console.log(err);
        return res.status(500).send();
    }
  });