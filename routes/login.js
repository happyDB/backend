var express = require('express');
const session = require('express-session');
var router = express.Router();
var myDatabase = require('../db/db_conn');
var connection = myDatabase.init();


connection.connect(function (err) {   
    if (err) {     
      console.error('mysql connection error');     
      console.error(err);     
      throw err;   
    } 
});

router.use(session({
    key: 'sid',
    secret: 'secret',
    resave: 'false', 
    saveUninitialized: true,
    cookie:{
      maxAge: 24000* 60* 60
    },
  }));

var loginData = {
    id : "pyi",
    pwd : "1212",
    nickname : "yeongin"
};//db연결 전 test용

router.get("/api/login", function(req, res, next) {
    var sess = req.session;
    console.log(sess);
    res.send(sess);
});

router.post("/api/login",function(req,res,err){
    var sess;
    sess = req.session;
    var userInfo = {
        id : req.body.id,
        pwd: req.body.pwd,
    };
   
        connection.query(`SELECT Member_ID, Name, Password, Authority FROM HappyBoardGame.MEMBER WHERE Name='${userInfo.id}'`,
        function(err,results){
            if (results != ""){
                console.log(results);
                var rows = JSON.parse(JSON.stringify(results[0]));
            
            //let salt = Math.round((new Date().valueOf() * Math.random())) + "";
          //  let hashPassword = crypto.createHash("sha512").update(userInfo.pwd + rows.salt).digest("hex");
            console.log(rows.Member_ID, rows.Password);
            if(rows.Name == userInfo.id && userInfo.pwd == rows.Password){
                console.log("로그인 성공");
                sess.logined = true;
                sess.userID = rows.Member_ID;
                sess.nickname = rows.Name;
                sess.authority=rows.Authority;
                console.log(sess);
                res.send(sess);
            }
            else {
                    console.log("로그인 실패");
                    sess.logined = false;
                    res.send(sess);
                    //res.end();
            }
        
        }
        else {
            console.log("회원 정보가 없음.")
            sess.logined = false;
            res.send(sess);
        }
    });
    
});

router.delete("/api/logout",function(req,res,err) {
    req.session.destroy();
    res.clearCookie('sid');
    console.log("logout success");
    console.log(req.session);
    res.redirect("..");
});


//INSERT INTO `HappyBoardGame`.`MEMBER` (`Member_ID`, `Name`, `Password`, `Authority`) VALUES ('pyi7628', 'YeongIn', '7628', '0');//회원가입
module.exports = router;
