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

router.post("/searchStore",function(req,res,err){
    
    var storeName = req.body.storeName;
    var regionStr = '%' + req.body.region + '%';
    var storeNameStr = '%' + storeName + '%';
    var gameHasedStr = '%' + req.body.gameHased + "%";
    var openTime = req.body.openTime;
    var closeTime = req.body.closeTime;
    console.log(storeNameStr);
    
    connection.query(`SELECT *  FROM HappyBoardGame.STORE WHERE Name LIKE '${storeNameStr}' OR (Add1 LIKE '${regionStr}' OR Add2 LIKE '${regionStr}') OR Store_ID IN (select Store_ID from HappyBoardGame.HAS Where Board_game_ID in (select Board_Game_ID from HappyBoardGame.BOARD_GAME where Title like '${gameHasedStr}')) OR Open_time = '${openTime}' OR Close_time = '${closeTime}'`, function(err,rows,fields){
        if(!err){
            var storeResult = JSON.parse(JSON.stringify(rows));
            console.log(storeResult); 
            res.send(storeResult);          
        }
        else{
            console.log(err);
        }
    })
});

module.exports = router;