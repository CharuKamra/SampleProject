const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


//@desc Register the user
//@route POST /api/users/register
//@access public

const registerUser = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      res.status(400);
      throw new Error("All fields are mandatory!");
    }
    const userAvailable = await User.findOne({ email });
    if (userAvailable) {
      res.status(400);
      throw new Error("User already registered!");
    }
  
    //Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("Hashed Password: ", hashedPassword);
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });
  
    console.log(`User created ${user}`);
    if (user) {
      res.status(201).json({ _id: user.id, email: user.email });
    } else {
      res.status(400);
      throw new Error("User data us not valid");
    }
    res.json({ message: "Register the user" });
  });

//@desc Register the user
//@route POST /api/users/register
//@access public

const loginUser = asyncHandler(async(request, response) => {
  const {email, password} = request.body;
  if(!email || !password){
    response.status(400);
    throw new Error("All fields are mandatory!");
  }
  const user = await User.findOne({email});
  if(!user){
    response.status(400);
    throw new Error("The User is not registered. Please register first!");
  }
  if(user && (await bcrypt.compare(password, user.password))){
    const accessToken = jwt.sign({
      user: {
        username: user.username,
        email: user.email,
        id: user.id,
      }
    }, 
    process.env.ACCESS_TOKEN_SECRET,
    {expiresIn: "15m"})
    response.status(200).json({accessToken});
  }
  else{
    response.status(401);
    throw new Error("The Email or Password is not valid!");
  }
});

//@desc Register the user
//@route POST /api/users/register
//@access public

const currentUser = asyncHandler(async(request, response) => {
    response.json({message : 'Current user information!'});
});



module.exports = {registerUser, loginUser, currentUser};