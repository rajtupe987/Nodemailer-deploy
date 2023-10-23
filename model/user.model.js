const mongoose=require("mongoose");

const userSchema=mongoose.Schema({
    username:{type:String, required:true},
    email:{type:String, required:true},
    password:{type:String, require:true}
})

const userModel=mongoose.model("user",userSchema);


module.exports={
    userModel
}