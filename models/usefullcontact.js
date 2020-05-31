var mongoose=require('mongoose');
var Schema=mongoose.Schema;
//var bcrypt=require('bcrypt-nodejs');
var usefullcontactSchema=new Schema({
    name:{type:String,required:true},
    contactno:{type:String,required:true},
    service:{type:String,required:true}
});


module.exports=mongoose.model('Usefullcontact',usefullcontactSchema);
//module.exports=mongoose.model('SBcategory',sbcategorySchema);






