import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
dotenv.config()
import cookieParser from 'cookie-parser'
import morgan from 'morgan'
import helmet from 'helmet'
import connectToDb from './config/connectDB.js'
import userRouter from './routes/user.route.js'


const app = express();
const PORT = 8080 || process.env.PORT

app.use (cors({
    credential : true,
    origin: process.env.FRONTEND_URL
}))

app.use(express.json())
app.use(cookieParser())
app.use(morgan())
app.use(helmet({
    crossOriginResourcePolicy: false
}))

app.get('/', (req, res) =>{
    res.json("Bismillah hir rahman nir raheem!!!!")
})

app.use('/api/user',userRouter)

connectToDb().then(() =>{
    app.listen(PORT, () =>{
        console.log(`Server is running on ${PORT}`)
    })
})
