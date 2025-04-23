import UserModel from "../models/user.model.js";
import bcrypt from "bcrypt";
import sendEmail from "../config/sendEmail.js";
import verifyEmailTemplate from "../utils/verifyEmailTemplate.js";
import generatedAccessToken from "../utils/generatedAccessToken.js";
import genertedRefreshToken from "../utils/genertedRefreshToken.js";

export async function registerUserController(req, res) {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Provide name, email, password",
        error: true,
        success: false,
      });
    }

    const user = await UserModel.findOne({ email });

    if (user) {
      return res.json({
        message: "This email is already registered",
        error: true,
        success: false,
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    const payload = {
      name,
      email,
      password: hashPassword,
    };

    const newUser = new UserModel(payload);
    const save = await newUser.save();

    const verifyEmailUrl = `${process.env.FRONTEND_URL}/verify-email?code=${save?._id}`;

    const verifyEmail = await sendEmail({
      sendTo: email,
      subject: "Verify email from Grocify",
      html: verifyEmailTemplate({
        name,
        url: verifyEmailUrl,
      }),
    });

    return res.json({
      message: "User registered successfully",
      error: false,
      success: true,
      data: save,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

export async function verifyEmailController(req, res) {
  try {
    const { code } = req.body;

    const user = await UserModel.findOne({ _id: code });

    if (!user) {
      return res.status(400).json({
        message: "Invalid code",
        error: true,
        success: false,
      });
    }

    const updateUser = await UserModel.updateOne(
      { _id: code },
      {
        verify_email: true,
      }
    );

    return res.json({
      message: "Email Verified",
      success: true,
      error: false,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

export async function loginController(req, res) {
  try {
    const { email, password } = req.body;
    
    if( !email || !password ) {
      return res.status(400).json({
        message: "Provide email, password",
        error: true, 
        success: false,
      })
    }

    const user = await UserModel.findOne({ email });

    if(!user) {
      return res.status(400).json({
        message: "User not registered", 
        error: true, 
        success: false,
      })
    }

    if(user.status !== "Active") {
      return res.status(400).json({
        message: "Contact to Admin", 
        error: true, 
        success: false,
      })
    }

    const checkPassword = await bcrypt.compare(password, user.password);

    if(!checkPassword) {
      return res.status(400).json({
        message: "Check your password", 
        error: true,
        success: false,
      })
    }

    const accessToken = await generatedAccessToken(user._id);
    const refreshToken = await genertedRefreshToken(user._id);

    const updateUser = await UserModel.findByIdAndUpdate(user?._id, {
      last_login_date : new Date()
    })

    const cookiesOption = {
      httpOnly: true, 
      secure: true, 
      sameSite: "None",
    }

    res.cookie('accessToken', accessToken, cookiesOption);
    res.cookie('refreshToken', refreshToken, cookiesOption);

    return res.json({
      message: "Login successfully", 
      error: false, 
      success: true, 
      data: {
        accessToken,
        refreshToken
      }
    })
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true, 
      success: false
    })
  }
} 
