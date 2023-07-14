const User = require("../models/user.model");
const ErrorHandler = require("../utils/errorHandler");
const cloudinary = require("../utils/cloudinary");
const {catchAsyncError} = require("../middleware/catchAsyncError");
const sendToken = require("../utils/sendToken");
const sendEmail = require("../utils/sendEmail")
exports.register = catchAsyncError(async(req,res,next)=>{
    console.log(req.body);
            const{name,fname,lname,email,password,reEnterPassword,birthdate}= req.body;
            
    
            const upload = await cloudinary.v2.uploader.upload(req.file.path)
          
            // const photo = upload.secure_url
         
            if(!( name && fname && email && password && reEnterPassword && birthdate))
            {
            res.status(400).send("all fields are required")
        }
        
        const oldUser = await User.findOne({ email });
        
    if (oldUser) {
        return res.status(409).send("User Already Exist. Please Login");
      }
    
            const newUser = await User.create({
                name,
                fname,
                lname,
                email,
                password,
                reEnterPassword,
                birthdate,
                photo: upload.url
            });
    
            res.status(200).json({
                success:true,
                message:"User Register Successfully",
                newUser          
        })}
       );


//login controller 

exports.login = catchAsyncError(async(req,res,next)=>{
    
        console.log('req.body', req.body);
   
   const {email,password} = req.body;

   if(!email || !password){
    return next(new ErrorHandler("Please enter your credentials",401))
   }
        const user = await User.findOne({email: email}).select("+password");
        console.log('user', user);
if(!user){
    return next(new ErrorHandler("Invalid Email and Password",401))
}

const checkPassword = await user.comparePasword(password);

console.log("check",checkPassword);

if(!checkPassword){
    return next(new ErrorHandler("Invalid Email and Password",401 ))
}
 sendToken(res,user,201)

        // res.status(200).json({message:"user login successfully",user});
     
})

exports.logout = catchAsyncError(async (req, res, next) => {
    res
      .status(200)
      .cookie("token", null, {
        expires: new Date(Date.now()),
      })
      .json({
        success: true,
        message: "Logged out successfully",
      });
  });


  exports.ForgotPassword = catchAsyncError(async(req,res,next)=>{
    const { email } = req.body;
    const user = await User.findOne({ email });

    // function generateOTP() {
    //     return Math.floor(100000 + Math.random() * 900000);
    //   }

    const resetOTP = user.getPaswordResetOTP();
    await user.save();

    const message = `Your password reset OTP is ${resetOTP}`;

    try {
        await sendEmail({
          email: user.email,
          subject: "Password recovery One-Time Password (OTP)",
          text: message,
        });
        res.status(200).json({
          succcess: true,
          message: `OTP sent to this email ${user.email} successfully`,
        });
      } catch (error) {
        user.resetPasswordOTP = undefined;
    user.resetPasswordExpire = undefined;
      return next(new ErrorHandler(error.message, 401));
      }
})


exports.getOTP= catchAsyncError(async(req,res,next)=>{
    console.log('req.body', req.body);
   
   const {email,OTP} = req.body;

   const user = await User.findOne({email:email})
   console.log(user,"user")

   if(!user){
    return next(new ErrorHandler("wrong credentials",401))
}

   if(!OTP){
    return next(new ErrorHandler("Please enter Correct OTP",401))
   }

   await user.save();

 if (user.resetPasswordOTP == OTP) {
 // user.resetPasswordOTP = undefined;
    // user.resetPasswordExpire = undefined;
     res.status(200).send({
        success:true
    })
 }  else{
 return next(new ErrorHandler("otp is invalid",401))
 }

})