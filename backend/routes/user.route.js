import { Router } from 'express'
import { forgotPasswordController, loginController, logoutController, registerUserController, resetPassword, updateUserDetails, uploadAvatar, verifyEmailController, verifyForgotPasswordOtp } from '../controllers/user.controller.js'
import auth from '../middleware/auth.js'
import upload from '../middleware/multer.js'

const userRouter = Router()

userRouter.post('/register', registerUserController)
userRouter.post('/verify-email', verifyEmailController)
userRouter.post('/login', loginController)
userRouter.get('/logout', auth, logoutController)
userRouter.put('/upload-avatar', auth, upload.single('avatar'), uploadAvatar)
userRouter.put('/user-update', auth, updateUserDetails)
userRouter.put('/forgot-password', forgotPasswordController)
userRouter.put('/verify-forgot-pass-otp', verifyForgotPasswordOtp)
userRouter.put('/reset-password', resetPassword)



export default userRouter