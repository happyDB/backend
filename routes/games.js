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
//SELECT distinct B.Board_game_ID, B.Title, B.Img_url FROM HappyBoardGame.BOARD_GAME B, HappyBoardGame.GENRES G where B.Board_game_ID=G.Board_game_ID and G.Genre in (select Genre from HappyBoardGame.GENRES where Board_game_ID in (select Board_game_ID from HappyBoardGame.LIKES where Member_ID=2))and B.Board_game_ID not in (select Board_game_ID from HappyBoardGame.LIKES where Member_ID=2)
router.get("/recommand",function(req,res,err){
    connection.query('SELECT * FROM HappyBoardGame.BOARD_GAME B, HappyBoardGame.GENRES G where B.Board_game_ID=G.Board_game_ID and G.Genre in (select Genre from HappyBoardGame.GENRES where Board_game_ID in (select Board_game_ID from HappyBoardGame.LIKES where Member_ID=2))and B.Board_game_ID not in (select Board_game_ID from HappyBoardGame.LIKES where Member_ID=2) group by B.Board_game_ID', function(err,rows,fields){
        if(!err){

           var gameResult = JSON.parse(JSON.stringify(rows));
           
           res.send(gameResult);
          
        }
        else{
            console.log(err);
        }
    })
});

router.get("/gamegenre/:idx",function(req,res,err){
    var id= req.params.idx;
    connection.query('SELECT * FROM HappyBoardGame.GENRES where Board_game_ID='+id, function(err,rows,fields){
        if(!err){

           var gameResult = JSON.parse(JSON.stringify(rows));
           console.log(gameResult)
           res.send(gameResult);
          
        }
        else{
            console.log(err);
        }
    })
});

router.get("/boardgame/:idx",function(req,res,err){
    var id= req.params.idx;
    connection.query('SELECT * FROM HappyBoardGame.BOARD_GAME where Board_game_ID='+id, function(err,rows,fields){
        if(!err){

           var gameResult = JSON.parse(JSON.stringify(rows[0]));
           console.log(gameResult)
           res.send(gameResult);
          
        }
        else{
            console.log(err);
        }
    })
});

module.exports = router;

