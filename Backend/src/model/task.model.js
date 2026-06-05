import { Schema , model } from 'mongoose';

const taskSchema = new Schema({
    title : {
        type : String,
        required : true,
        trim : true
    },
    description : {
        type : String,
        trim : true,
        default : ""
    },
    status : {
        type : String,
        enum : ['pending', 'completed'],
        default : 'pending'
    },
    userId : {
        type : Schema.Types.ObjectId,
        ref : "User",
        required : true,
        index : true
    }
} , { timestamps : true})

export const Task = model("Task" , taskSchema)
