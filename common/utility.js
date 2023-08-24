
const db = require('../db/dbcon');
const crypto = require('crypto');

const checkEmail =  function(email)
{
   return new Promise(function (resolve,reject)
   {
    
    
        var dbcon = db.connect();
        dbcon.getConnection((err,con)=>{
            if(err)
            return reject(err);
        con.query('SELECT * FROM Users WHERE email_address=?',[email], function (err, result) {
            // dbcon.destroy();
            console.log("result",result);
            if(err)
            return reject (err);
            // console.log("Result in check email function",result);
            return resolve (result);

        })
        con.release();
   })
   
})}

function checkPassword(password,userHash,salt)
    {
        const hash = crypto
		.pbkdf2Sync(password, salt, 10000, 64, "sha512")
		.toString("hex");
	return hash === userHash;
    }
    function setPassword (password)
    {
         passwordSalt = crypto.randomBytes(16).toString('HEX');
 
         passwordHash = crypto.pbkdf2Sync(password,passwordSalt,10000,64,'sha512').toString('HEX');
         console.log("hello")
        
         return {passwordHash,passwordSalt};
    }

    function regData(userObj)
    {
         return new Promise(function(resolve,reject)
         {
    
            console.log(userObj)
    
            var dbcon = db.connect();
        dbcon.getConnection((err,con)=>{
            if(err)
            return reject(err);
             con.query('INSERT INTO Users (fname,lname,mname,address,city,state,country,pincode,email_address,contact_number,password,passwordHash,passwordSalt) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)',[userObj.fname,userObj.lname,userObj.mname,userObj.address,userObj.city,userObj.state,userObj.country,userObj.pincode,userObj.email_address,userObj.contact_number,userObj.password,userObj.passwordHash,userObj.passwordSalt],(err,result)=>
             {console.log("hello");
                //  con.release();
                 if(err)
                 return reject (err);
                console.log("result",result);
                return resolve(result);
             })
             con.release();
            })
             
            })
        
         
         callback();
         
    }


module.exports= {
    checkEmail,checkPassword,setPassword,regData
}