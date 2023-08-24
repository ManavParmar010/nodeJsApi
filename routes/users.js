var express = require('express');
var router = express.Router();
var auth = require('../config/authstreategy')();
var db =require('../db/dbcon')
/* GET users listing. */
router.get('/',auth.authenticate(),async function(req, res, next) {
  console.log("request:",req.rawHeaders[13]);
  var dbcon = db.connect();
  dbcon.getConnection((err,con)=>{
    if(err)
    return res.send(err);
con.query("select * from Users where id_User=?",req.rawHeaders[13],function(err,result)
{
  if(err)
  return res.send(err);
  else
  return res.send(result);

})
con.release();
})
  
});

module.exports = router;
