var express =require('express');
var passport =  require('passport');
var Localstrategy = require('passport-local');
var crypto = require('crypto');
var db = require('../db/dbcon');
const { error, log } = require('console');
var utility = require('../common/utility')
var jwt = require('jwt-simple');
var cfg = require('../config/config')

var router = express.Router();

router.get('/login',(req,res,next)=>
{
    console.log("get")
    res.render('login');
});
router.post('/', function(req,res,next)
{
    // console.log(dbcon.connect());
    

    // function authUser(email)
    // {
    //    return new Promise(function (resolve,reject)
    //    {
    //     // var dbcon = db.connect();

        
    //         dbcon.query('SELECT * FROM Users WHERE email_address=?',[email], function (err, result) {
    //             // dbcon.release();
    //             // console.log("result",result);
    //             if(err)
    //             return reject (err);
    //             return resolve (result);
           
    //    } )
    // })}

    console.log(req);
    const{
        body:{
            email,password
        }
    }=req;
    if(!email)
    return res.status(422).json({error:{email:'is required'}})
    if(!password)
    return res.status(422).json({eroor:{password:'is required'}})

    let userobj = {
        email,
        password
      } 
    
    async function login(params,callback)
    {
        
        try
        {userobj={
            email:params.email,
            password:params.password
        }

        // console.log('userObj',userobj);
        let checkEmailResult = await utility.checkEmail(userobj.email);
        // let password = await checkPassword(userobj.password);
        
        // let userAuth = await authUser(userobj.email,userobj.password)
        
        // console.log("email Result",password)
        // if(checkEmailResult==password)
        // console.log(userAuth);
        // callback();
        // else
        // return res.redirect('http://localhost:4200/login')


        console.log("check email",checkEmailResult);
    // console.log("checkEmailResult.length",checkEmailResult.length);
        
        if(checkEmailResult.length > 0){
            const metadata = utility.checkPassword(params.password, checkEmailResult[0].passwordHash, checkEmailResult[0].passwordSalt);
      
            console.log("metadata", metadata);
      
            if(metadata == true){
              
              var payload = {
                          email: params.email,
                          password: params.password,
                          role: "USER",
                          userid: checkEmailResult[0].id,
                      };
                      var token = jwt.encode(payload,cfg.jwtSecret);
                      console.log(token);
                    //   console.log("in here");
                    //   console.log("UserID ", checkEmail[0].id);
      
                      var resData = {
                          id: checkEmailResult[0].id_user,
                          status: "success",
                          msg: "User Valid",
                          token: token,
                          key_2fa: "",
                          name: checkEmailResult[0].fname,
                          email: checkEmailResult[0].email_address,
                      };
              callback(resData);
            }else{
              callback({status:'fail', msg: 'Invalid creds'});
            }
      
          }else{
            callback({status:'success', msg: 'Invalid email'});
          }
          
      
        } catch (e) {
          return callback(e);
        }
    }
    login(userobj,(err)=>
    {
        if(err)
        return res.send(err);
        else
        {
        return res.send(userobj);
        }
    });    
    
})





module.exports = router;

console.log(exports);