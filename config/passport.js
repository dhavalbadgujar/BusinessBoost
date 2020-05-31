var passport=require('passport');
var User=require('../models/user');
var Business=require('../models/business');
var LocalStrategy=require('passport-local').Strategy;
var nodemailer=require('nodemailer');

passport.serializeUser(function(user,done){
    done(null,user.id);
});
passport.deserializeUser(function(id,done){
    User.findById(id,function(err,user){
        done(err,user);
    });
});
passport.use('local.signup',new LocalStrategy({
   
    usernameField:'email',
    passwordField:'password',
    passReqToCallback:true
},function(req,email,password,done){
    req.checkBody('name','invlid Name ').notEmpty();
    //req.checkBody('contactno','invlid contactno ').notEmpty().isLength({min:10,max:10});
    req.checkBody('email','invlid email ').notEmpty().isEmail();
    req.checkBody('password','invlid PAssword brother').notEmpty().isLength({min:4});

    var errors=req.validationErrors();

    if(errors){
        var messages=[];
        errors.forEach(function(error){
            messages.push(error.msg);
        });
        return done(null,false,req.flash('error',messages));
    }


    User.findOne({'email':email},function(err,user){
        if(err)
        {
            return done(err);
        }
        if(user){
           return done(null,false,{message:'Email is already in use.'});
        }
        var newUser=new User();
        newUser.email=email;
        newUser.password=newUser.encryptPassword(password);
       // newUser.password="admin";
        newUser.name=req.body.name;
        newUser.contactno=req.body.contactno;
        newUser.type="2";//1 for admin & 2 for businessman
        newUser.status=false; //active and disactive
        newUser.joindate=new Date();

        newUser.save(function(err,result){
                if(err){
                    return done(err);
                }

                var newbusiness=new Business();
                newbusiness.userid=email;
                newbusiness.businessname="";
                newbusiness.address1="";
                newbusiness.address2="";
                newbusiness.emailid1=email;
                newbusiness.emailid2="";
                newbusiness.phoneno1="";
                newbusiness.phoneno2="";
                newbusiness.city="";
                newbusiness.aboutus="";
                newbusiness.aboutusimage="";
                newbusiness.businessubcatid=null;
                newbusiness.gstno="";
                newbusiness.businesslogo="";
                newbusiness.businesslogoname="";

                newbusiness.save(function(err,result){
                    if(err){
                        return done(err);
                    }

                    var transporter = nodemailer.createTransport({
                        service: 'Gmail',
                        auth: {
                          user: 'businessboosttt@gmail.com',
                          pass: 'business12123'
                        }
                      });
                      var mailOptions = {
                        from: 'businessboosttt@gmail.com',
                        to: email,
                        subject: 'Your Business request sent successfully.',
                        text: 'Wait for the admin response'
                      };
                      transporter.sendMail(mailOptions, function(error, info){
                        if (error) {
                          console.log(error);
                        } else {
                          console.log('Email sent: ' + info.response);
                          //res.render('mailButton');
                        }
                      });





                    return done(null,newUser,newbusiness);
                    
                });
                



               // return done(null,newUser);
                
        });

       /* var newbusiness=new Business();
        newbusiness.userid=email;
        newbusiness.businesname="";
        newbusiness. address1="";
        newbusiness.address2="";
        newbusiness.emailid1="";
        newbusiness.emailid2="";
        newbusiness.phoneno1="";
        newbusiness.phoneno2="";
        newbusiness.city="";
        newbusiness.aboutus="";
        newbusiness.aboutusimage="";
        newbusiness.businessubcatid="";
        newbusiness.gstno="";

        newbusiness.save(function(err,result){
            if(err){
                return done(err);
            }
            return done(null,newbusiness);
            
        }); */

    });
}));

passport.use('local.signin',new LocalStrategy({
    usernameField:'email',
    passwordField:'password',
    passReqToCallback:true
},function(req,email,password,done){
    req.checkBody('email','invlid email bro').notEmpty().isEmail();
    req.checkBody('password','invlid PAssword brother').notEmpty();
    var errors=req.validationErrors();

    if(errors){
        var messages=[];
        errors.forEach(function(error){
            messages.push(error.msg);
        });
        return done(null,false,req.flash('error',messages));
    }

    User.findOne({'email':email},function(err,user){
        if(err)
        {
            return done(err);
        }
        if(!user){
           return done(null,false,{message:'No user Found.'});
        }
        if(!user.validPassword(password)){
            return done(null,false,{message:'Wrong password.'});
        }
        /*console.log(user.email);
        console.log(user.status);

        if(user.status=="1"){
            
        }
        else{

        }*/

       return done(null,user);
    });
}));