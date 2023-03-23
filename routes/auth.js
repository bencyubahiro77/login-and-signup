const router = require('express').Router();
const User = require('../model/User');
const brcypt = require('bcryptjs');
const Jwt = require('jsonwebtoken');
const{registerValidation, loginValidation} = require('../validations/authValidation')

router.post('/register', async (req, res) => {

  // validating the data
  const {error} = registerValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  
  // checking if the user is already in database
  const emailExist = await User.findOne({email: req.body.email});
  if(emailExist) return res.status(400).send('Email already exists')

  // Hash the password

  const salt = await brcypt.genSalt(10);
  const  hashedPassword = await brcypt.hash(req.body.password, salt);

  //create new user
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: hashedPassword,
  });

  try {
    const savedUser = await user.save();
    res.send(savedUser);
  } catch (err) {
    res.status(400).send(err);
  }
});


router.post('/login',  async (req, res) => {

    //validating the data
   const {error} = loginValidation(req.body);
   if (error) return res.status(400).send(error.details[0].message);

   // checking if email is in the database
   const user = await User.findOne({email: req.body.email});
   if(!user) return res.status(400).send('Incorrect email or Password ');
   //check if password correct
   const checkPass = await brcypt.compare(req.body.password, user.password);
   if(!checkPass) return res.status(400).send('incorrect email or password');

   // create a token for logged in user
   const token = Jwt.sign({_id: user._id}, process.env.JWT_SECRET);
   res.header('auth-token', token).send(token);
});

module.exports = router;
