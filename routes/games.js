var express = require('express');;
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

router.get("/recommand",function(req,res,err){
    connection.query('select * from HappyBoardGame.BOARD_GAME', function(err,rows,fields){
        if(!err){

           var gameResult = JSON.parse(JSON.stringify(rows));
           
           res.send(gameResult);
          
        }
        else{
            console.log(err);
        }
    })
});

module.exports = router;

