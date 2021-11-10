const router = require('express').Router()
const User = require('../models/User')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const {registerValidation,loginValidation} = require('../routes/validation')



router.post('/register', async (req, res) => {

   // VALIDATE BEFORE SAVING A USER 
   const {error} = registerValidation(req.body)
   if(error) return res.status(400).send(error.details[0].message)
   
   // Checking if user is already in database
   const emailExist = await User.findOne({email: req.body.email})
   if(emailExist) return res.status(400).send('Oops email exist already')

// Hash the password 
const salt = await bcrypt.genSalt(10)
const hashedPassword = await bcrypt.hash(req.body.password, salt)

   // Create New User 
    const user = new User ({
        name: req.body.name, 
        email: req.body.email,
        password: hashedPassword
    })
    try{
        const savedUser = await user.save()
        res.send({savedUser}) // res.send({user: user._id}) --shows just user Id instead of the hased Password
    } catch(err){
        res.status(400).send(err)
    }


})
 
// Login 
router.post('/login', async (req, res) => {

    // VALIDATE BEFORE SAVING A USER 
   const {error} = loginValidation(req.body)
   if(error) return res.status(400).send(error.details[0].message)

     // Checking if user is already in database
     const user = await User.findOne({email: req.body.email})
     if(!user) return res.status(400).send('Email Not Found')
     const validPass = await bcrypt.compare(req.body.password, user.password)
     if(!validPass) return res.status(400).send('Invalid Password')



     // Create and assign a token
     const token = jwt.sign({_id: user.id}, process.env.TOKEN_SECRET)
     res.header('auth-token', token).send(token)


     res.send('Logged in!')


})

module.exports = router
