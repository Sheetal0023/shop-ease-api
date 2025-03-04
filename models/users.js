const express = require("express")
const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true,
    },
    phone:{
        type:Number,
        required:true

    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true,
        trim:true
    },
    otp:{
        type:String,
    },
    forgotToken:{
        type:String,
    },
    tokens:[{
        token:{
            type:String,
            required:true
        }
    }]
    
})

const User = mongoose.model('User', userSchema)

module.exports = User