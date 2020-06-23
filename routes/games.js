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

router.post("/searchGame", function(req, res, err){
    var title = req.body.title;
    var playTimeMin = req.body.playTimeMin;
    var playTimeMax = req.body.playTimeMax;
    var numOfPlayers = req.body.numOfPlayers;
    var genres = req.body.genres;
    var types = req.body.types;

    for (var i in genres){
        genres[i] = JSON.stringify(genres[i]);
    }
    for (var j in types){
        types[j] = JSON.stringify(types[j]);
    }
    console.log(genres);

    var titleStr = '%' + title + '%';
    var genreStr = genres.join();
    var typeStr = types.join();

    console.log(titleStr);
    //console.log(genreStr);
    if(genreStr == ''){
        genreStr += "\"더미\"";
    }
    if(typeStr == ''){
        typeStr += "\"더미\"";
    }

    //console.log(typeStr);

    if(numOfPlayers == 0){
        connection.query(`SELECT * FROM HappyBoardGame.BOARD_GAME WHERE Title LIKE '${titleStr}' AND Min_play >= ${playTimeMin} AND Max_play <= ${playTimeMax} AND Board_game_ID IN (select Board_game_ID from HappyBoardGame.GENRES where Genre not in (${genreStr})) AND Board_game_ID IN (select Board_game_ID from HappyBoardGame.BG_TYPE where Type not in (${typeStr}))`, function(err,rows,fields){
            if(!err){
    
               var gameResult = JSON.parse(JSON.stringify(rows));
               console.log(gameResult);               
               res.send(gameResult);
              
            }
            else{
                console.log(err);
            }
        })
    }
    else{
        connection.query(`SELECT * FROM HappyBoardGame.BOARD_GAME WHERE Title LIKE '${titleStr}' AND Min_play >= ${playTimeMin} AND Max_play <= ${playTimeMax} AND Board_game_ID IN (select Board_game_ID from HappyBoardGame.NUM_OF_PLAYERS WHERE Number_of_players = ${numOfPlayers}) AND Board_game_ID IN (select Board_game_ID from HappyBoardGame.GENRES where Genre not in (${genreStr})) AND Board_game_ID IN (select Board_game_ID from HappyBoardGame.BG_TYPE where Type not in (${typeStr}))`, function(err,rows,fields){
            if(!err){
    
               var gameResult = JSON.parse(JSON.stringify(rows));
               //console.log(gameResult);                
               res.send(gameResult);
              
            }
            else{
                console.log(err);
            }
        })

    }
    
})

module.exports = router;

