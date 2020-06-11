var express = require('express');
const session = require('express-session');
var router = express.Router();

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
   
            if(loginData.id == userInfo.id && loginData.pwd == userInfo.pwd){
                console.log("로그인 성공");
                sess.logined = true;
                sess.name = userInfo.id;
                sess.nickname = loginData.nickname;
                console.log(sess);
                res.send(sess);
            }
            else {
                    console.log("로그인 실패");
                    sess.logined = false;
                    res.send(sess);
            }
    
});

router.delete("/api/logout",function(req,res,err) {
    req.session.destroy();
    res.clearCookie('sid');
    console.log("logout success");
    console.log(req.session);
    res.redirect("..");
});

module.exports = router;
