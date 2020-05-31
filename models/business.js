var mongoose=require('mongoose');
var Schema=mongoose.Schema;
//var bcrypt=require('bcrypt-nodejs');
var SBcategory=require('../models/businessSubCategories');
var busniessSchema=new Schema({
    userid:{type:String,required:true},
    businessname:{type:String},
    address1:{type:String},
    address2:{type:String},
    emailid1:{type:String},
    emailid2:{type:String},
    phoneno1:{type:String},
    phoneno2:{type:String},
    city:{type:String},
    aboutus:{type:String},
    //aboutusimage:{type:String},
    businesslogo:{type:String},
    businesslogoname:{type:String},
    businessubcatid:{type:mongoose.Schema.Types.ObjectId,ref:'SBcategory'},
    gstno:{type:String}
});


module.exports=mongoose.model('Business',busniessSchema);