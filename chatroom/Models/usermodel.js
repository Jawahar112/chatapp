
import  mongoose from 'mongoose'
const Schema=mongoose.Schema
const Usersschema=new Schema({
    Email:{
        required:true,
        type:String
    },
    Password:{
        required:true,
        type:String
    }
  
   });
export default  mongoose.model("Users",Usersschema);