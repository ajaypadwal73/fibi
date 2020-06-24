const mongoose = require("mongoose");
const Schema = mongoose.Schema; 
const mongoosePaginate = require("mongoose-paginate-v2")

//Create Schema
const UserSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    extractData:{
        type : String
    }
});

UserSchema.plugin(mongoosePaginate)

module.exports = User = mongoose.model('users', UserSchema);