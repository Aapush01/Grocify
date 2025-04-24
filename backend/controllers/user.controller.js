import UserModel from "../models/user.model.js";
import bcrypt from "bcrypt";
import sendEmail from "../config/sendEmail.js";
import verifyEmailTemplate from "../utils/verifyEmailTemplate.js";
import generatedAccessToken from "../utils/generatedAccessToken.js";
import genertedRefreshToken from "../utils/genertedRefreshToken.js";
import uploadImageCloudinary from "../utils/uploadImageCloudinary.js";
import generateOtp from "../utils/generateOtp.js";
import forgotPasswordTemplate from "../utils/forgotPasswordTemplate.js";

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

    if (!email || !password) {
      return res.status(400).json({
        message: "Provide email, password",
        error: true,
        success: false,
      });
    }

    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "User not registered",
        error: true,
        success: false,
      });
    }

    if (user.status !== "Active") {
      return res.status(400).json({
        message: "Contact to Admin",
        error: true,
        success: false,
      });
    }

    const checkPassword = await bcrypt.compare(password, user.password);

    if (!checkPassword) {
      return res.status(400).json({
        message: "Check your password",
        error: true,
        success: false,
      });
    }

    const accessToken = await generatedAccessToken(user._id);
    const refreshToken = await genertedRefreshToken(user._id);

    const updateUser = await UserModel.findByIdAndUpdate(user?._id, {
      last_login_date: new Date(),
    });

    const cookiesOption = {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    };

    res.cookie("accessToken", accessToken, cookiesOption);
    res.cookie("refreshToken", refreshToken, cookiesOption);

    return res.json({
      message: "Login successfully",
      error: false,
      success: true,
      data: {
        accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

export async function logoutController(req, res) {
  try {
    const userid = req.userId; //middlware

    const cookiesOption = {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    };

    res.clearCookie("accessToken", cookiesOption);
    res.clearCookie("refreshToken", cookiesOption);

    const removeRefreshToken = await UserModel.findByIdAndUpdate(userid, {
      refresh_token: "",
    });

    return res.json({
      message: "Successfully logged out.",
      error: false,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      seccuss: false,
    });
  }
}

export async function uploadAvatar(req, res) {
  try {
    const userId = req.userId; //auth middleware
    const image = req.file; //multer middleware

    const upload = await uploadImageCloudinary(image);

    const updateUser = await UserModel.findByIdAndUpdate(userId, {
      avatar: upload.url,
    });

    return res.json({
      message: "uploaded profile avatar",
      success: true,
      error: false,
      data: {
        _id: userId,
        avatar: upload.url,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

export async function updateUserDetails(req, res) {
  try {
    const userId = req.userId; //auth middleware
    const { name, email, mobile, password } = req.body;

    let hashPassword = "";

    if (password) {
      const salt = await bcrypt.genSalt(10);
      hashPassword = await bcrypt.hash(password, salt);
    }

    const updateUser = await UserModel.updateOne(
      { _id: userId },
      {
        ...(name && { name: name }), //I'm using spread operator here
        ...(email && { email: email }),
        ...(mobile && { mobile: mobile }),
        ...(password && { password: hashPassword }),
      }
    );

    return res.json({
      message: "Updated successfully",
      error: false,
      success: true,
      data: updateUser,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

export async function forgotPasswordController(req, res) {
  try {
    const { email } = req.body;

    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "This email is not registered.",
        error: true,
        success: false,
      });
    }

    const otp = generateOtp();
    const expireTime = new Date(Date.now() + 60 * 60 * 1000); // 1hr

    const update = await UserModel.findByIdAndUpdate(user._id, {
      forgot_password_otp: otp,
      forgot_password_expiry: new Date(expireTime).toISOString(),
    });

    await sendEmail({
      sendTo: email,
      subject: "Forgot password from Grocify",
      html: forgotPasswordTemplate({
        name: user.name,
        otp: otp,
      }),
    });

    return res.json({
      message: "Please check your email.",
      error: false,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

export async function verifyForgotPasswordOtp(req, res) {
  try {
    const { email, otp } = req.body;

    if( !email || !otp ) {
      return res.status(400).json({
        message: "Please provide the required fields: email and OTP.",
        error: true,
        success: false
      })
    }

    const user = await UserModel.findOne({ email });

    if( !user ) {
      return res.status(400).json({
        message: "Email not found.",
        error: true,
        success: false
      })
    }

    const currentTime = new Date().toISOString();

    if(user.forgot_password_expiry < currentTime ) {
      return res.status(400).json({
        message: "Otp is expired.",
        error: true,
        success: false
      })
    }

    if( otp !== user.forgot_password_otp ) {
      return res.status(400).json({
        message: "Invalid Otp",
        error: true,
        success: false
      })
    }

    const updateUser = await UserModel.findByIdAndUpdate(user?._id, {
      forgot_password_otp: "",
      forgot_password_expiry: ""
    })

    return res.json({
      message: "The OTP has been successfully verified.",
      error: false,
      success: true
    })

  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false
    })
  }
}
