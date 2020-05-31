var express = require('express');
var router = express.Router();
var Bcategory=require('../models/businessCategories');
var User=require('../models/user');
var csrf=require('csurf');
var nodemailer=require('nodemailer');
var passport=require('passport');

var csrfProtection=csrf(); //required --npm install --save express-session

router.use(csrfProtection);

router.get('/Admin/', function(req, res, next) {
   // var username=req.query.username;
   //var username1=req.query;
   var username1=req.query.username;
    User.find({type:"2"})
.then (function(doc){
    var item2=doc;
    console.log(item2);
    console.log(username1);
    res.render('admin/admincontent',{csrfToken:req.csrfToken(),users:item2,username:username1}); 
});
  });

  ///admin/addbcategory

  router.post('/Admin/admin/addbcategory', function(req, res, next) {
    var addbusinesscatory={
      categoryname:req.body.bcategoryname
    
    };
    
    var abc=new Bcategory(addbusinesscatory);
    
    abc.save();
   

   });








module.exports = router;