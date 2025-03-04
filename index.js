const express = require("express")
const cors = require("cors")

var cookieParser = require('cookie-parser')


const port =  process.env.PORT;

const app = express()
app.use(cors())
app.use(cookieParser())



const bodyParser = require('body-parser')

require("./db/mongoose") //Mongoose Data Base connect
const userRouter = require("./routers/user")

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Mongoose SetUp

// const mongoose = require("mongoose")

// mongoose.connect("mongodb+srv://ReactApp:ReactApp@reactapp.keza1.mongodb.net/?retryWrites=true&w=majority&appName=ReactApp")

app.use(userRouter)


app.listen(port, () => {
    console.log(`Port ${port} is running`)
})
