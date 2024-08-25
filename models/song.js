const mongoose = require('mongoose')


const songSchema=mongoose.Schema({
    title:{type:String},
    artist:{type:String},
    albumId:{type:String},
    genre:{type:String},
    postedBy:{type:String},
    createTime:{type:Date,default:Date.now()},
    isAvailable:{type:Boolean,default:true},

});

module.exports=mongoose.model("songs",songSchema);