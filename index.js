const express=require("express");

const {connection}=require("./config/db");
const {userRoute}=require("./routes/user.route");
const {dataRouter}=require("./routes/dataroute")
const {authMiddleWare}=require("./middleware/authentication");
const cors=require("cors")

require("dotenv").config()
const app=express();

app.use(express.json());

app.use(cors());
// app.use(
//     cors({
//       origin: ['http://127.0.0.1:5500', 'null'],
//       methods: ['GET', 'POST','PUT',"DELETE"],
//       allowedHeaders: ['Content-Type'],
//     })
//   );




app.use("/api",userRoute);
app.use(authMiddleWare);
app.get("/data",(req,res)=>{
    try {
        res.send("Welcome to mailernode")
    } catch (error) {
        res.status(404).send({"msg":error.message})
    }
})
// app.use("/check",dataRouter)

app.listen(process.env.port,async()=>{
    try {
        await connection;
        console.log("db connected to server.")
    } catch (error) {
        console.log(error)
    }
})