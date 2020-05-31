var mongoose=require('mongoose');
var Schema=mongoose.Schema;
var bcrypt=require('bcrypt-nodejs');
var bcategorySchema=new Schema({
   
    categoryname:{type:String,required:true},
});

/*var sbcategorySchema=new Schema({
    bcategory:{type:mongoose.Schema.Types.ObjectId,ref:'bcategories',required:true},
    categoryname:{type:String,required:true}
});*/

module.exports=mongoose.model('Bcategory',bcategorySchema);
//module.exports=mongoose.model('SBcategory',sbcategorySchema);






