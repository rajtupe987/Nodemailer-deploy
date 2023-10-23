

const express=require("express");

const dataRoute=express.Router();


dataRoute.get("/data",(req,res)=>{

    try {
      res.status(200).send("welcome to Zysk foundation")
    } catch (error) {
      res.status(400).send({message:error.message})
    }
  
  })

  module.exports={
    dataRoute
  }