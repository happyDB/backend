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

router.get("/likes",function(req,res,err){
    let userID=req.session.userID;
    connection.query(`SELECT * FROM HappyBoardGame.BOARD_GAME B, HappyBoardGame.LIKES L, HappyBoardGame.GENRES G  where B.Board_game_ID=L.Board_game_ID and L.Member_ID=${userID} and B.Board_game_ID=G.Board_game_ID group by B.Board_game_ID`, function(err,rows,fields){
        if(!err){

           var gameResult = JSON.parse(JSON.stringify(rows));
           
           res.send(gameResult);
          
        }
        else{
            console.log(err);
        }
    })
});

//SELECT distinct B.Board_game_ID, B.Title, B.Img_url FROM HappyBoardGame.BOARD_GAME B, HappyBoardGame.GENRES G where B.Board_game_ID=G.Board_game_ID and G.Genre in (select Genre from HappyBoardGame.GENRES where Board_game_ID in (select Board_game_ID from HappyBoardGame.LIKES where Member_ID=2))and B.Board_game_ID not in (select Board_game_ID from HappyBoardGame.LIKES where Member_ID=2)
router.get("/recommand",function(req,res,err){
    let userID=req.session.userID;
    connection.query('SELECT * FROM HappyBoardGame.BOARD_GAME B, HappyBoardGame.GENRES G where B.Board_game_ID=G.Board_game_ID and G.Genre in (select Genre from HappyBoardGame.GENRES where Board_game_ID in (select Board_game_ID from HappyBoardGame.LIKES where Member_ID='+userID+'))and B.Board_game_ID not in (select Board_game_ID from HappyBoardGame.LIKES where Member_ID='+userID+') group by B.Board_game_ID', function(err,rows,fields){
        if(!err){

           var gameResult = JSON.parse(JSON.stringify(rows));
           
           res.send(gameResult);
          
        }
        else{
            console.log(err);
        }
    })
});

router.get("/all",function(req,res,err){
    let userID=req.session.userID;
    connection.query('SELECT * FROM HappyBoardGame.BOARD_GAME B, HappyBoardGame.GENRES G where B.Board_game_ID=G.Board_game_ID group by B.Board_game_ID ', function(err,rows,fields){
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

router.get("/heart/:idx",function(req,res,err){
    var gameID= req.params.idx;
    let userID=req.session.userID;
    
    connection.query('SELECT * FROM HappyBoardGame.LIKES where Board_game_ID='+gameID+' and Member_ID='+userID, function(err,rows,fields){
        if(!err){
            if(rows==""){//좋아요 표시 안되어있는 경우
               var heartResult ={
                   heart: false
               }
               res.send(heartResult);
            }
            else{
                var heartResult ={
                    heart: true
                }
                console.log(heartResult)
                res.send(heartResult);
            }      
        }
        else{
            console.log(err);
        }
    })
});

router.post("/heart/:idx",function(req,res,err){
    var gameID= req.params.idx;
    let userID=req.body.userID;
    
    connection.query(`INSERT INTO HappyBoardGame.LIKES (Member_ID, Board_game_ID) VALUES ('${userID}', '${gameID}');`, function(err,rows,fields){
        if(err){
            res.send(err);
            console.log(err);
        }
    });
    res.end();
});

router.delete("/heart/:idx",function(req,res,err){
    var gameID= req.params.idx;
    let userID=req.body.userID;
    
    connection.query(`delete from HappyBoardGame.LIKES where Member_ID=${userID} and Board_game_ID=${gameID}`, function(err,rows,fields){
        if(err){
            res.send(err);
            console.log(err);
        }
    });
    res.end();
});

router.get("/boardgame/:idx/review",function(req,res,err){
    var id= req.params.idx;
    connection.query('SELECT Review_ID, Comment, Rating, R.Member_ID, R.Board_game_ID, M.Name FROM HappyBoardGame.REVIEW R, HappyBoardGame.MEMBER M where R.Board_game_ID='+id+' and M.Member_ID=R.Member_ID', function(err,rows,fields){
        if(!err){
           res.send(rows);
          
        }
        else{
            console.log(err);
        }
    })
});

router.post("/boardgame/:idx/review",function(req,res,err){
    var id= req.params.idx;
    console.log("id in post :"+ id);
    var body = req.body;
    var gameID=id;
    var userID = body.userID;
    var content = body.content;
    var rating= body.rating;

   console.log("??"+`${userID} ${content} ${gameID} ${rating}`)
    connection.query(`INSERT INTO HappyBoardGame.REVIEW (Comment, Rating, Member_ID, Board_game_ID) VALUES ('${content}', '${rating}', '${userID}', '${gameID}')`, 
    function(err,rows,fields){
        if(err){
            res.send(err);
            console.log(err);
        }
    });
    res.end();
});

router.delete("/review/:idx",function(req,res,err){//자신의 댓글을 삭제할 수 있는 부분!
    var id= req.params.idx;
    console.log("id :"+ id);
    connection.query(`delete from HappyBoardGame.REVIEW where Review_ID=${id}`, function(err,rows,fields){
        if(err){
            res.send(err);
            console.log(err);
        }
    });
    res.end();
});
router.get("/boardgame/:idx/player",function(req,res,err){
    var id= req.params.idx;
    connection.query('SELECT *  FROM HappyBoardGame.NUM_OF_PLAYERS  where Board_game_ID='+id, function(err,rows,fields){
        if(!err){
           res.send(rows);
          
        }
        else{
            console.log(err);
        }
    })
});

module.exports = router;

