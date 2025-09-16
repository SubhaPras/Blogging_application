import mongoose from 'mongoose'

const blockedUserSchema = new mongoose.Schema({
    email : {
        type : String,
        require : true
    }
})

const BlockedUser = mongoose.model('BlockedUser', blockedUserSchema)

export default BlockedUser;