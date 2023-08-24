const passport = require("passport");
const { Strategy, ExtractJwt } = require("passport-jwt");
const cfg = require('./config');
const db = require('../db/dbcon');
const utility = require('../common/utility')
var params = {
    secretOrKey : cfg.jwtSecret,
    jwtFromRequest:ExtractJwt.fromAuthHeaderAsBearerToken(),
    passReqTocallBack:true
}

module.exports = function () {
    var userStategy = new Strategy(params,async function(payload,done)
{
    console.log(payload);
    let userData = await utility.checkEmail(payload.email);
    console.log(userData);
    if(userData.length>0)
    {
        userDetails = userData[0];
        console.log("2")
        var validatePassword = utility.checkPassword(payload.password,userDetails.passwordHash,userDetails.passwordSalt);
        if(!validatePassword)
        {
            console.log("3");
            return done(null,false,{message:"invalid combo"});
        }
        else {
            var dbcon = db.connect();
        dbcon.getConnection((err,con)=>{
            if(err)
            throw err;
            con.query('SELECT * FROM Users WHERE email_address=? AND passwordHash = ?', [payload.email, userDetails.passwordHash],function (err, result) {
                console.log("\n ", this.sql);
                // con.destroy();
                if (err) {
                    console.log("err",err);
                    return done(new Error("Connection Error"), null);
                }
                if (result.length < 1) {
                    return done(null, false, { message: 'User Not found' });
                }
                let user = JSON.parse(JSON.stringify(result));
                console.log("user ", user)
                try {
                    return done(null, {
                        userID: payload.userid,
                        email: payload.email,
                        // Username: payload.username,
                        role: payload.role,
                        // logged_dt: payload.logged_dt
                    });
                } catch (e) {
                    return done(null,false, { message: 'User Not found' });
                }
            });
            con.release();
        })
          
        }
    } else {
        return done(null,false, { message: 'User Not found' });
    }

})

passport.use(userStategy);

return {
    initialize: function () {
        return passport.initialize();
    },
    authenticate: function () {
       
        return passport.authenticate("jwt", cfg.jwtSession);
    }
};
}