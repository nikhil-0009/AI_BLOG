import mongoose from "mongoose"

const commentSchema=new mongoose.Schema({
    blog:{type:mongoose.Schema.Types.ObjectId,
        ref:'blog',
        required:true
    },
    user:{type:mongoose.Schema.Types.ObjectId,
        ref:'user',
        required:true
    },
    name:{type:String,
        required:true
    },
    content:{type:String,
        required:true
    },
    isApproved:{type:Boolean,
        default: false,
        required:true,
    }

},{timestamps:true})


const Comment= mongoose.model('comment',commentSchema)

export default Comment