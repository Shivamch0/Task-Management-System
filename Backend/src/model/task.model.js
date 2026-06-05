import { Schema , model } from 'mongoose';

const taskSchema = new Schema({
    tile : {
        type : String,
        required : true,
    },
    description : {
        type : String,
    },
    status : {
        type : String,
        enum : ['pending', 'completed'],
        default : 'pending'
    },
    userId : {
        type : Schema.Types.ObjectId,
        ref : "User"
    }
} , { timestamps : true})

export const Task = model("Task" , taskSchema)