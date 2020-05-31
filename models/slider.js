var mongoose=require('mongoose');
var Schema=mongoose.Schema;
var bcrypt=require('bcrypt-nodejs');
var Business=require('../models/business');

var sliderSchema=new Schema({
    businessid:{type:mongoose.Schema.Types.ObjectId,ref:'Business',required:true},
    imagepath:{type:String},
    imagename:{type:String},
}); 

module.exports=mongoose.model('Slider',sliderSchema);

