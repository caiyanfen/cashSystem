const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const profileScheam =new Schema({
    type:{
        String
    },
    describe:{
        String
    },
    income:{
        type:String,
        required:true
    },
    expend:{
        type:String,
        required:true
    },
    cash:{
        type:String,
        required:true
    },
    remark:{
        type:String
    },
    date:{
        type:Date,
        default:Date.now
    }

});

module.exports = Profile =mongoose.model('profiles',profileScheam);