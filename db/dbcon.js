// var mysql = require('mysql');

// var dbcon = mysql.createConnection({
//     host:"localhost",
//     user:"root",
//     password:"Manav@10503",
//     database:"ModishFeet"
// });
// dbcon.connect((err)=>
// {
//     if(err)
//     throw err;
//     console.log("database connected!!");
// })
 
// module.exports=dbcon;

var mysql = require("mysql");

var pool  = null;

exports.connect = function () {
    pool = mysql.createPool({
        connectionLimit : 1000,
        host:"localhost",
    user:"root",
    password:"Manav@10503",
    database:"ModishFeet",
        multipleStatements: true
    });

    return pool;
}

