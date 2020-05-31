var express = require('express');
var router = express.Router();

//var alert=require('alert-node');
const notifier = require('node-notifier');
//var JSAlert = require('js-alert');
//const Growl = require('node-notifier').Growl;
//const NotifySend = require('node-notifier').NotifySend;
//var alertify=require('alertifyjs');
//var swal=require('sweetalert');

var csrf=require('csurf');
var nodemailer=require('nodemailer');
var passport=require('passport');

var csrfProtection=csrf(); //required --npm install --save express-session

router.use(csrfProtection);

var User=require('../models/user');
var Bcategory=require('../models/businessCategories');
var SBcategory=require('../models/businessSubCategories');
var Usefullcontact=require('../models/usefullcontact');
var Business=require('../models/business');
var Slider=require('../models/slider');
var Product=require('../models/product');

var bcrypt=require('bcrypt-nodejs');

var mongoose=require('mongoose');
var Schema=mongoose.Schema;
var citySchema=new Schema({
  Srno:{type:Number},
  cityName:{type:String}
  
},{collection:'city'});


var cityData=mongoose.model('cityData',citySchema);





var multer=require('multer');
var path = require('path');
const storage=multer.diskStorage({
  destination:'./public/images',
  filename:function(req,file,cb){
    cb(null,file.fieldname + Date.now() + path.extname(file.originalname));
  }
});




/* GET home page. */
router.get('/', function(req, res, next) {

  
  Bcategory.find()
  .then(function(bcat){
    res.render('visitor/index',{csrfToken:req.csrfToken(),bcat:bcat});
  });

  //res.render('visitor/index');
  
});






router.get('/mygetsubcdata/:item', function(req, res, next) {
  console.log(req.params.item);

  SBcategory.find({_id:req.params.item})
  .then(function(bcdata){
    //console.log(bcdata);
    var subdata=bcdata;
    console.log("************************************"+bcdata);
    res.json(bcdata);
    //res.render('visitor/index',{subdata:subdata});
  });

  //res.render('visitor/index');
});





router.post('/openallwebsite', function(req, res, next){
  console.log(req.body.fetchid);
  var myid=req.body.fetchid;
  SBcategory.find({_id:myid})
  .then(function(bcdata){
    //console.log(bcdata);
    var subdata=bcdata;
    console.log("************************************"+bcdata);
   

    Business.find({businessubcatid:myid})
  .then(function(bdata){
    res.render('visitor/Getcatweb',{subdata:subdata,bdata:bdata});
  });



    //res.render('visitor/Getcatweb',{subdata:subdata});
  });


});

router.get('/visitor/Getcatweb', function(req, res, next) {

  console.log('body: ' + JSON.stringify(req.query.mydata));

  console.log("hereeee"+req.query.mydata);
  const myobj=req.query.mydata;
  const objValue=JSON.stringify(myobj);
  const parseData=JSON.parse(objValue);
  console.log("heyyyyyyyyyyyyyyyyyyyyyyyy"+myobj[0]);
  
});








router.get('/visitor/dashboard',isLoggedIn, function(req, res, next) {
  //res.render('visitor/index');

  var useriid=req.user.id;
  var userid=req.user.email;
  var username=req.user.name;
  var userstatus=req.user.type;
  var accessid=req.user.status;

  //console.log(userid);
  if(userstatus=="1"){   
     // res.render('admin/admincontent',{username:username});
    // res.redirect('/admin/Admin/?username='+username);
   // res.redirect('/admin/Admin?username='+username+"&uid="+userid);
   //var username1=req.query.username;

   User.find({_id:useriid})
   .then(function(mymaindata){

   User.find({type:"2"})
  .then (function(doc){
   var item2=doc;
   //console.log(item2);
   //console.log(username1);

    Bcategory.find()
    .then(function(doc1){
      var bcdata=doc1;
       // console.log(bcdata);


        SBcategory.find()
          .populate('bcategory','categoryname')
          .exec()
          .then(function(doc2){

            var sbcdata=doc2;

            Usefullcontact.find()
              .then(function(doc3){
                var ufcdata=doc3;

                User.find({status:false}).count(function(err,inactiveuser){

                  User.find({status:true}).count(function(err,activeuser){

                    res.render('admin/admincontent',{csrfToken:req.csrfToken(),activeuser:activeuser,inactiveuser:inactiveuser,mymaindata:mymaindata,users:item2,bcdata:bcdata,sbcdata:sbcdata,ufcdata:ufcdata,username:username}); 

                  });

                });




                  //res.render('admin/admincontent',{csrfToken:req.csrfToken(),mymaindata:mymaindata,users:item2,bcdata:bcdata,sbcdata:sbcdata,ufcdata:ufcdata,username:username}); 
              });

            //res.render('admin/admincontent',{csrfToken:req.csrfToken(),users:item2,bcdata:bcdata,sbcdata:sbcdata,username:username}); 
          });

        //res.render('admin/admincontent',{csrfToken:req.csrfToken(),users:item2,bcdata:bcdata,username:username}); 
    });

  });

   //res.render('admin/admincontent',{csrfToken:req.csrfToken(),users:item2,username:username}); 
});
  // res.redirect('/admin/Admin?username='+username);
  }
  else if(userstatus=="2" && accessid==true){

    
   User.find({_id:useriid})
   .then(function(mymaindata){

    console.log(mymaindata);
    

    User.find({type:"1"})
  .then (function(doc){

    Bcategory.find()
    .then(function(bcdata){

      Business.find({userid:userid})
      .then(function(businessdata){

        console.log(businessdata);

        var getbid=businessdata.map((business)=>{return business._id});
        //console.log(getbid);

       


       Slider.find({businessid:getbid})
        .then(function(myallsliderdata){
          //console.log("myallslider------------"+myallslider);

          var myfirst=myallsliderdata[0];
         // console.log("myfirst---------------"+myfirst);

          Slider.find({businessid:getbid})
          .skip(1)
          .then(function(myrest){
            //console.log("---------------"+gatsliderdata);


            Product.find({businessid:getbid})
            .then(function(myproduct){

              cityData.find()
              .then(function(citydata){
                res.render('businessman/businesscontent',{csrfToken:req.csrfToken(),mymaindata:mymaindata,citydata:citydata,myproduct:myproduct,myallsliderdata:myallsliderdata,myrest:myrest,myfirst:myfirst,username:username,doc:doc,businessdata:businessdata,bcdata:bcdata}); 
              });

              //res.render('businessman/businesscontent',{csrfToken:req.csrfToken(),myproduct:myproduct,myallsliderdata:myallsliderdata,myrest:myrest,myfirst:myfirst,username:username,doc:doc,businessdata:businessdata,bcdata:bcdata}); 
            });


            //res.render('businessman/businesscontent',{csrfToken:req.csrfToken(),myallsliderdata:myallsliderdata,myrest:myrest,myfirst:myfirst,username:username,doc:doc,businessdata:businessdata,bcdata:bcdata}); 

          });


        });
        });
      
        //console.log(gatsliderdata);
  
       // res.render('businessman/businesscontent',{csrfToken:req.csrfToken(),username:username,doc:doc,businessdata:businessdata,bcdata:bcdata}); 

      });  
        //res.render('businessman/businesscontent',{username:username,doc:doc,bcdata:bcdata}); 
    });

    //res.render('businessman/businesscontent',{username:username,doc:doc}); 
  });

   //res.render('businessman/businesscontent',{username:username}); 
  }
  else if(userstatus=="2" && accessid==false){
    res.render('visitor/Signin'); 
  }
  else{
    res.render('visitor/Signin');
  }

});



router.get('/emailotp', function(req, res, next) {
  var messages=req.flash('error');
  res.render('visitor/Emailotp',{csrfToken:req.csrfToken(),messages:messages,hasErrors:messages.length>0});
});



var random;
var ceilRandom;

let sessionEmail;
router.post('/otp',function(req,res,next){
  User.find({email:req.body.email}).then(function(getEmailResponse){

      console.log("@@@@@@@@@@");
      console.log(getEmailResponse);

      if(getEmailResponse.length){

        sessionEmail=req.session;
        sessionEmail.email=req.body.email; 
       
          random=Math.random()*(9999-1000)+1000;
          ceilRandom=Math.ceil(random);
          console.log("RANDOM***");
          console.log(ceilRandom);
      
          var transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
              user: 'businessboosttt@gmail.com',
              pass: 'business12123'
            }
          });
          
         var mailOptions = {
          from: 'businessboosttt@gmail.com',
          to: req.body.email,
          subject: 'OTP FOR YOUR ACCOUNT',
            text: 'YOUR OTP IS : '+ceilRandom
          };
          
          transporter.sendMail(mailOptions, function(error, info){
            if (error) {
              console.log(error);
            } else {
              
              console.log('Email sent: ' + info.response);
             
              res.redirect('/checkOTP');
        
            }
          });

      }else{
            req.flash('noemail','No user found!');
            res.redirect('/emailotp');
      }
  });
 
});


router.get('/checkOTP', function(req, res, next) {
  var messages=req.flash('error');
  res.render('visitor/Otp',{csrfToken:req.csrfToken(),messages:messages,hasErrors:messages.length>0});
});

router.post('/checkOTP',function(req,res,next){
  if(req.body.otp==ceilRandom){
    res.redirect('/resetPassword');
  }
  else{
    //console.log("No");
    req.flash('errors','Invalid OTP!');
    res.redirect('/checkOTP');
  }

});

router.get('/resetPassword',function(req,res,next){
  var msgs=req.flash('errors1');
  res.render('visitor/Resetpassword',{csrfToken:req.csrfToken(),hasErrors:msgs.length>0,msg1:msgs});
});


router.post('/resetPassword',function(req,res,next){
  var newUser=new User();
  var newPass=req.body.password;
  var reenter=req.body.reenter;

  sessionEmail=req.session;
  let getsessionemail=sessionEmail.email;
  if(newPass==reenter){
    User.findOneAndUpdate({email:getsessionemail},{$set:{password:newUser.encryptPassword(newPass)}},function(err,docReset){

      if(!err){
        
        console.log("Password Updated");
      }
    });
  
    console.log("EMail"+getsessionemail);
    res.redirect('visitor/Signin');
  }
  else{
    req.flash('errors1','Passwords are not same');
    res.redirect('visitor/Signin');
  }
});

























router.get('/visitor/Signin', function(req, res, next) {
  var messages=req.flash('error');
  res.render('visitor/signin',{csrfToken:req.csrfToken(),messages:messages,hasErrors:messages.length>0});
});

router.post('/visitor/signin',passport.authenticate('local.signin',{  
  successRedirect:'/visitor/dashboard',
  failureRedirect:'/visitor/signin',
  failureFlash:true
}));

router.get('/visitor/Signup', function(req, res, next) {
  var messages=req.flash('error');
    res.render('visitor/signup',{csrfToken:req.csrfToken(),messages:messages,hasErrors:messages.length>0});
});

router.post('/visitor/signup',passport.authenticate('local.signup',{
  successRedirect:'/visitor/signup',
  failureRedirect:'/visitor/signup',
  failureFlash:true
}));

























///===========================================ADMIN=========================================================////

router.post('/admin/addbcategory', function(req, res, next){
  var addbusinesscatory={
    categoryname:req.body.bcategoryname
  
  }; 
  var abc=new Bcategory(addbusinesscatory);
  Bcategory.findOne({'categoryname':req.body.bcategoryname},function(err,category,done){
   
      if(!category){
        abc.save();
        res.redirect('/visitor/dashboard');
      }
      if(category){

        notifier.notify({
          'title': 'Ⓑᴜꜱɪɴᴇꜱꜱ Ⓑᴏᴏꜱᴛ Alert !!',
          'subtitle': 'Daily Maintenance',
          'message': 'Alreay Business category is there !!',
          //'icon': 'dwb-logo.png',
          //'contentImage': 'blog.png',
          //'sound': 'ding.mp3',
          'wait': true
        });

        /*notifier.on('click', function(notifierObject, options, event) {
          // Triggers if `wait: true` and user clicks notification
        });*/
        
      }
  });
 
});



router.post('/admin/addsubbcategory', function(req, res, next){
  var addsubbusinesscatory={
    bcategory:req.body.bcategory,
    subcategoryname:req.body.subcategoryname
  
  }; 
  var asbc=new SBcategory(addsubbusinesscatory);
  SBcategory.findOne({'subcategoryname':req.body.subcategoryname},function(err,category,done){
   
      if(!category){
        asbc.save();
        res.redirect('/visitor/dashboard');
      }
      if(category){

        notifier.notify({
          'title': 'Ⓑᴜꜱɪɴᴇꜱꜱ Ⓑᴏᴏꜱᴛ Alert !!',
          'subtitle': 'Daily Maintenance',
          'message': 'Alreay Business category is there !!',
          //'icon': 'dwb-logo.png',
          //'contentImage': 'blog.png',
          //'sound': 'ding.mp3',
          'wait': true
        });

        /*notifier.on('click', function(notifierObject, options, event) {
          // Triggers if `wait: true` and user clicks notification
        });*/
        
      }
  });
 
});


router.post('/admin/addusefullcontact', function(req, res, next){
  var addusefullcontact={
    name:req.body.name,
    contactno:req.body.contactno,
    service:req.body.service
  }; 
  var auc=new Usefullcontact(addusefullcontact);
  
        auc.save();
        res.redirect('/visitor/dashboard');
   
});



router.get('/delete/deletesubcategory/:id',function(req,res,next){
  SBcategory.findByIdAndRemove(req.params.id).exec();
  res.redirect('/visitor/dashboard');
});

router.get('/delete/deleteusefullcontact/:id',function(req,res,next){
  Usefullcontact.findByIdAndRemove(req.params.id).exec();
  res.redirect('/visitor/dashboard');
});


router.get('/update/updateuserstatust/:email/:status/:id',function(req,res,next){
  var myemail=req.params.email;
  var mystatus=req.params.status;
  var id=req.params.id;
  /*console.log(id);
  console.log(myemail);
  console.log(mystatus);*/

  var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: 'businessboosttt@gmail.com',
      pass: 'business12123'
    }
  });
  
  var mailOptions = {
    from: 'businessboosttt@gmail.com',
    to: myemail,
    subject: 'Build your Business Website',
    text: 'your userid is '+myemail+' and password is b1234 .'
  };
  
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
      //res.render('mailButton');

    }
  });


    User.findOneAndUpdate({_id:id},{$set:{status:true}}
      ,function(err, doc){
      
      if(err){
          console.error('error, no entry found');
      }   
      //console.log(req.body._id);
      res.redirect('/visitor/dashboard');
    });
});


router.get('/update/updateuserstatusf/:email/:status/:id',function(req,res,next){
  var myemail=req.params.email;
  var mystatus=req.params.status;
  var id=req.params.id;
  /*console.log(id);
  console.log(myemail);
  console.log(mystatus);*/

  var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: 'businessboosttt@gmail.com',
      pass: 'business12123'
    }
  });
  var mailOptions = {
    from: 'businessboosttt@gmail.com',
    to: myemail,
    subject: 'Your account is disactive.',
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

    User.findOneAndUpdate({_id:id},{$set:{status:false}}
      ,function(err, doc){
      
      if(err){
          console.error('error, no entry found');
      }
      //console.log(req.body._id);
      res.redirect('/visitor/dashboard');
    });
    
});

router.get('/update/updateusefullcontact/:id', function (req, res, next) {
 
  var id=req.body.id;
  var name=req.body.name;
  var contactno=req.body.contactno;
  var service=req.body.service;

console.log(id,name,contactno,service);
console.log("--------------------");
  /*Usefullcontact.findOneAndUpdate({_id:id},{$set:{name:name,contactno:contactno,service:service}}
    ,function(err, doc){
    
    if(err){
        console.error('error, no entry found');
    }   
    //console.log(req.body._id);
    res.redirect('/visitor/dashboard');
  });*/

  /*Usefullcontact.findById(id,function(err,doc){
    if(err){
      console.error('error , no entry found');
    }
    doc.name=req.body.name;
    doc.contactno=req.body.contactno;
    doc.service=req.body.service;
    doc.save();
  });*/
  res.redirect('/visitor/dashboard');

});
















///===========================================Businessman=========================================================////


router.post('/updatebusinesscontent', function(req, res, next){
  var upload=multer({
    storage:storage,
    //limits:{fileSize:1000000},
    fileFilter:function(req,file,cb){
      checkFileType(file,cb);
    }
  }).single('businesslogo');

  function checkFileType(file,cb){
    const filetypes=/jpeg|jpg|png|gif/;
    const extname=filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype=filetypes.test(file.mimetype);
    if(extname && mimetype){
      return cb(null,true);
    }
    else{
      cb('Error');
    }
  }
  upload(req,res,function(err){
    if(err){
      console.log(err);
      res.render('/visitor/dashboard');
    }
    else{
      Business.findByIdAndUpdate({	_id:req.body.id},
                {$set:
                  {
                    businessname:req.body.businessname,
                    address1:req.body.address1,
                    address2:req.body.address2,
                    emailid1:req.body.emailid1,
                    emailid2:req.body.emailid2,
                    phoneno1:req.body.phoneno1,
                    phoneno2:req.body.phoneno2,
                    city:req.body.city,
                    aboutus:req.body.aboutus,
                    businessubcatid:req.body.businessubcatid,
                    gstno:req.body.gstno,
                    businesslogo: req.file.path,
                    businesslogoname:req.file.filename 
                
                }})

                  .then(function(err,updatebusinessdata){
        if(!err){
          console.log("++++++++++++++++"+err);
          res.redirect('/visitor/dashboard');
        }
  });
  res.redirect('/visitor/dashboard');

    }
  });

});






router.get('/getsubcdata/:item',function(req,res,next){
  SBcategory.find({bcategory:req.params.item})
  .then(function(bcdata){
    console.log(bcdata);
    res.json(bcdata);
  });
});


router.post('/business/addslider', function(req, res, next){
  var upload=multer({
    storage:storage,
    //limits:{fileSize:1000000},
    fileFilter:function(req,file,cb){
      checkFileType(file,cb);
    }
  }).single('sliderimage');

  function checkFileType(file,cb){
    const filetypes=/jpeg|jpg|png|gif/;
    const extname=filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype=filetypes.test(file.mimetype);
    if(extname && mimetype){
      return cb(null,true);
    }
    else{
      cb('Error');
    }
  }
  upload(req,res,function(err){
    if(err){
      res.render('/visitor/dashboard');
    }
    else{
      var addslider={
        businessid:req.body.id,
        imagepath: req.file.path,
        imagename:req.file.filename    
      };
      var insertFiles=new Slider(addslider);
      insertFiles.save();
        //console.log(req.file);
        res.redirect('/visitor/dashboard');
    }
  });
 
});

router.get('/delete/deletesliderimage/:id',function(req,res,next){
  Slider.findByIdAndRemove(req.params.id).exec();
  res.redirect('/visitor/dashboard');
});

router.post('/business/addproduct', function(req, res, next){
  var upload=multer({
    storage:storage,
    //limits:{fileSize:1000000},
    fileFilter:function(req,file,cb){
      checkFileType(file,cb);
    }
  }).single('productimage');

  function checkFileType(file,cb){
    const filetypes=/jpeg|jpg|png|gif/;
    const extname=filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype=filetypes.test(file.mimetype);
    if(extname && mimetype){
      return cb(null,true);
    }
    else{
      cb('Error');
    }
  }
  upload(req,res,function(err){
    if(err){
      res.render('/visitor/dashboard');
    }
    else{
      var addslider={
        businessid:req.body.id,
        productname:req.body.productname,
        productdes:req.body.productdes,
        productprice:req.body.productprice,
        imagepath: req.file.path,
        imagename:req.file.filename    
      };
      var insertFiles=new Product(addslider);
      insertFiles.save();
        //console.log(req.file);
        res.redirect('/visitor/dashboard');
    }
  });
 
});

router.get('/delete/deleteserviceproduct/:id',function(req,res,next){
  Product.findByIdAndRemove(req.params.id).exec();
  res.redirect('/visitor/dashboard');
});

router.get('/businesswebsite/businesswebsitecontent/:id',function(req,res,next){
 // console.log(req.params.id);
  Business.find({_id:req.params.id})
      .then(function(businessdata){
        //console.log(businessdata);

        Slider.find({businessid:req.params.id})
        .then(function(myallsliderdata){
          //console.log("myallslider------------"+myallslider);

          var myfirst=myallsliderdata[0];
         // console.log("myfirst---------------"+myfirst);

          Slider.find({businessid:req.params.id})
          .skip(1)
          .then(function(myrest){
            //console.log("---------------"+gatsliderdata);


            Product.find({businessid:req.params.id})
            .then(function(productdata){

              res.render('businesswebsite/businesswebsitecontent',{csrfToken:req.csrfToken(),businessdata:businessdata,myfirst:myfirst,myrest:myrest,productdata:productdata});

            });

          });

        });
        //res.render('businesswebsite/businesswebsitecontent',{businessdata:businessdata});
      });
  /*Product.findByIdAndRemove(req.params.id).exec();*/
 
});



router.post('/sendBusinessmail', function(req, res, next){
  var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: 'businessboosttt@gmail.com',
      pass: 'business12123'
    }
  });
  var mailOptions = {
    from: 'businessboosttt@gmail.com',
    to: req.body.myemail,
    subject: 'Notification from busiiness boosttt',
    text: 'Name : '+req.body.name+'\nEmail : '+req.body.email+'\nMobileno : '+req.body.mobileno+'\nSubject : '+req.body.subject
            +'\nMessage : '+req.body.message
  };
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
      //res.render('mailButton');
    }
    res.redirect('businesswebsite/businesswebsitecontent/'+req.body.bid);;
  });
});



















router.get('/logout',function(req,res,next){
  req.session.destroy();
  res.redirect('/visitor/signin');
});

router.post('/changepassword',function(req,res,next){
  var newUser=new User();
    //var oldpassword=newUser.encryptPassword(req.body.old);
   var generatedpassword=bcrypt.hashSync(req.body.new,bcrypt.genSaltSync(5),null);
  // var newhash=req.body.new;
    User.findOne({_id:req.body._id}).then(function(checkPassword){
         // res.send(checkPassword);
         
         getpassword=checkPassword.password

        bcrypt.compare(req.body.old,getpassword,function(err,res){
          if (err){
            console.log('error');
          }
          if(res){
           
                var newpassword=req.body.new;
                var reenter=req.body.again;

                if(newpassword==reenter){
                 
                  User.findOneAndUpdate({_id:req.body._id},{$set:{password:newUser.encryptPassword(req.body.new)}},function(err,docUpdated){

                    if(!err){
                      
                      console.log("Password Updated");
                    }
                  });


                }
                else{
                
                  console.log("Incorrect Passwords");
                }
          }
          else{
           
            console.log("NOO");
          }
        });
    
});
res.redirect("/visitor/dashboard");
});





module.exports = router;

function isLoggedIn(req,res,next){
  //console.log(req.user);
  //console.log(req.user.status);
  //console.log(req.isAuthenticated);
  //console.log(req.isAuthenticated());
  //console.log(req.next);
  
  //userstatus=req.user.type;
  //console.log(userstatus);
    if(req.isAuthenticated()){
      res.set('Cache-control','no-cache,private,no-store,must-revalidate,post-check=0,pre-check=0');
      return next();
    }
    res.redirect('/');
}

function notLoggedIn(req,res,next){
  if(!req.isAuthenticated()){
   
    return next();
  }
  res.redirect('/');
}