const express = require("express");

const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");

const userRoute = express.Router();

const nodemailer = require("nodemailer");


const { userModel } = require("../model/user.model");

require("dotenv").config()

// for specifying emailer service and authentication for sender
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.mail,
    pass: process.env.pass_for_mail
  }

})



userRoute.post("/signup", async (req, res) => {
  const { username, email, password } = req.body;
  const check = await userModel.find({ email });

  if (check.length > 0) {
    return res.status(400).json({ "ok": false, "msg": "User already exists" });
  }

  bcrypt.hash(password, 5, async (err, hash) => {
    try {
      if (err) {
        res.send(err.message);
      } else {
        const data = new userModel({ username, email, password: hash });
        await data.save();

        // Create the welcome email
        const mailOptions = {
          from: '"Zysk fund 👻" <rajtupe137@gmail.com>',
          to: email, // Recipient's email address who is going to reacive the mail
          subject: 'Welcome to Zysk foundation', // Subject of the email
          text: 'Thank you for signing up!' // Email message
        };

        // Send the email
        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.error(error);
          } else {
            console.log('Email sent:');
          }
        });

        res.status(200).json({ "ok": true, "msg": "Registered Successfully" });
      }
    } catch (error) {
      res.status(400).json({ "ok": false, "msg": error.message });
    }
  });
});


userRoute.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email:email });
    if (!user) {
      return res.status(401).json({ msg: "User with this email not found", ok: false })
    }
    const isPasswordSame = await bcrypt.compare(password, user.password)
    
    if (!isPasswordSame) {
      return res.status(401).json({ msg: "Invalid email or password", ok: false })
    }

    //{ userId: user._id } == this is going to encoded into jwt
    const token = jwt.sign({ userId: user._id }, process.env.secreat_key, { expiresIn: '1hr' })
    //const refreshToken = jwt.sign({ userId: user._id }, process.env.refresh_secret, { expiresIn: "3hr" })
    const response = {
      "ok": true,
      "token": token
    }

    res.status(200).json(response)
  } catch (error) {
    res.status(400).json({ "ok": false, "msg": error.message });
  }
})



module.exports = {
  userRoute
}