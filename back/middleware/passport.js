const passport = require('passport');
const User = require('../models/user');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const dotenv = require('dotenv');

dotenv.config();
const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.secretOrKey,
};


passport.use(
    new JwtStrategy(opts,async(jwt_payload,done)=>{
        try{
            const user = await User.findOne({_id:jwt_payload._id}).select(
                "-password"
            );
            user?done(null,user):done(null,false);
        }catch(error){
            console.log(error)
        }
    })
);

module.exports = isAuth = ()=> passport.authenticate("jwt",{session:false});
