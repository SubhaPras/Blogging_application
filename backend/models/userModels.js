import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    firstName: {
        type : String,
        require : true
    },
    lastName: {
        type : String,
        require : true
    },
    email: {
        type : String,
        require : true,
        unique : true
    },
    password: {
        type : String,
        require : true
    },
    bio: {
        type : String,
        default: ''
    },
    occupation: {
        type : String,
        default: ''
    },
      photoUrl: {
        type : String,
        default: ''
    },
      instagram: { type : String, default: ''},
      facebook: { type : String, default: ''},
      github: { type : String, default: ''},
      linkedin: { type : String, default: ''},

},{timestamps : true})

const User = mongoose.model('User', userSchema);

export default User;