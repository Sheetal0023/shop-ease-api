const express = require("express")
const User = require("../models/users")

const router = new express.Router()

const bcrypt = require("bcryptjs")

var jwt = require('jsonwebtoken');

router.get("/", async(req, res) => {
    const data = await User.findOne()
    var token = jwt.sign({_id: data._id }, 'thisisprivatekey');
            data.tokens = data.tokens.concat({token})
            data.tokens.pop()
            data.username = "Hash"
            await data.save()
    res.send(data)
})

router.post('/sign', async(req, res) => {
    try {
        const user = new User({
            username: req.body.username,
            phone: req.body.phonenumber,
            email: req.body.email,
            password: req.body.password
        })
        
        const errorfind = []

        const users = await User.findOne({
            email:req.body.email
        })

        const phoneUser = await User.findOne({
            phone: req.body.phonenumber
        })

        
        if(!user.username) {
            errorfind[0] = 'Please provide Username'
        }

        if(!user.phone) {
            errorfind[1] = 'Please provide Phone Number'

        } else {
            if(user.phone.toString().length !== 10 ){
                errorfind[1] = 'Provide a valid phone number'
            }
        }
        if(phoneUser) {
            errorfind[1] = 'This phone number is already used'
        }

        if(users){
            errorfind[2] = 'Email is already exist'

        }

        if(!user.password) {
            errorfind[3] = 'Please provide password'
        }

        if(user.password.length <= 6){
            errorfind[3] = 'Password is not Strong'
        }


        if(errorfind.length !== 0) {
            res.send( {
                errorUsername: errorfind[0],
                errorPhone: errorfind[1],
                errorEmail: errorfind[2],
                errorPassword: errorfind[3],
            })


        } else {
            user.password = await bcrypt.hash(user.password, 8)
            await user.save()
            res.status(201).send("User is Created")

        }

    } catch (error) {
        res.status(400).send(error)
        console.log(error)
    }
})

router.post('/login', async(req, res) => {
    try {
        const email = req.body.email
        const password = req.body.password

        const errorFind = []

    
        const user = await User.findOne({email})

        const match = await bcrypt.compare(password, user.password)
        
        if(!match) {
            errorFind[0] = "Invalid credentials"
        }


        if(errorFind.length !== 0) {
            res.send({
                errorUser : errorFind[0],
            })
        } else {
            var token = jwt.sign({_id: user._id }, 'thisisprivatekey');
            user.tokens = user.tokens.concat({_id:user._id,token})
            await user.save()

            res.status(200).send({
                username: user.username,
                email:user.email,
                phonenumber:user.phone,
                token,

            })
        }

    } catch (error) {
        res.status(404).send(error)
        console.log(error)
    }
})

router.post('/getuser', async(req, res) => {
    try {
        const email = req.body.localemail
        const json = req.body.localjson

        if(email && json) {
            const user = await User.findOne({email})
            const token = user.tokens.find((curtoken) => {
               return curtoken.token == json
            })

            if(token) {
                res.send({
                    username: user.username,
                    phone: user.phone,
                })
            } else {
                throw new Error("Please Log In")
            }
            
        } else {
            throw new Error("You are not Logged")
        }
    } catch (error) {
        res.send(error)
    }
})

router.get('/getusers', async(req, res) => {
    console.log(req.cookies.jsontoken)
    
})

module.exports = router