var mongoose=require('mongoose');
var Schema=mongoose.Schema;
var bcrypt=require('bcrypt-nodejs');
var Business=require('../models/business');

var productSchema=new Schema({
    businessid:{type:mongoose.Schema.Types.ObjectId,ref:'Business',required:true},
    productname:{type:String},
    productdes:{type:String},
    productprice:{type:String},
    imagepath:{type:String},
    imagename:{type:String},
}); 

module.exports=mongoose.model('Product',productSchema);

