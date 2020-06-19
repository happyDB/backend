var mysql = require('mysql');

module.exports =( function () {
    return {
        init : function () {
            return mysql.createConnection({
                host: 'happyboardgame.cmfyyjgfakwu.ap-northeast-2.rds.amazonaws.com',
                port: 3306,
                user: 'admin',   
                password: 'goldtodia',
         database: 'HappyBoardGame'  
            })
        }
    }

})();