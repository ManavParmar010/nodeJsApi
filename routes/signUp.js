const express =  require ('express');
const dbcon = require('../db/dbcon');
const crypto =require('crypto');
const { error } = require('console');
const { rejects } = require('assert');
const utility = require('../common/utility')
const router = express.Router();


router.post("/", async (req,res,next)=>
{
   const{
    body:{
        fname,lname,mname,address,city,state,country,pincode,email_address,contact_number,password
    },
   }=req

   if(!fname)
   return res.status(422).json({errors:{fname: "is required"}})

   if(!address)
   return res.status(422).json({errors:{address: "is required"}})

   if(!city)
   return res.status(422).json({errors:{city: "is required"}})

   if(!state)
   return res.status(422).json({errors:{state: "is required"}})

   if(!country)
   return res.status(422).json({errors:{country: "is required"}})

   if(!pincode)
   return res.status(422).json({errors:{pincode: "is required"}})

   if(!email_address)
   return res.status(422).json({errors:{email_address: "is required"}})

   if(!contact_number)
   return res.status(422).json({errors:{contact_number: "is required"}})

   if(!password)
   return res.status(422).json({errors:{password: "is required"}})

   try{


    let checkEmailResult = await utility.checkEmail(email_address);
    console.log(checkEmailResult.length);
    if(checkEmailResult.length == 0)
    {


   const metadata = await utility.setPassword(password);
   console.log("metadata",metadata);

   const userObj = {
    fname: fname,
    lname:lname,
    mname:mname,
    address:address,
    city:city,
    state:state,
    country:country,
    email_address:email_address,
    pincode:pincode,
    contact_number:contact_number,
    password:password,
    passwordSalt:metadata.passwordSalt,
    passwordHash:metadata.passwordHash
   }

    console.log("userObj",userObj);
    const regUser = await utility.regData(userObj)
    // dbcon.query("INSERT INTO Users ")
    console.log(regUser);
    if(regUser.affectedRows == 1 )
    {
        let resData = {
            message:"register Success",
            status:"success",
        }
        return res.send(resData);


    }
    else{
        return res.send(regUser);
    }
    
}
else{
    res.send("user already exists!!!");
}
   }
catch(e){
    res.send(e);

}
})

module.exports = router;