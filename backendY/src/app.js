import express from "express"
import cors from "cors"
import helmet, { contentSecurityPolicy } from "helmet"
import rateLimit from "express-rate-limit"
import authRoutes from "./routes/auth.route.js"
import { errorHandle } from "./middlewares/error.middleware.js"
import userRoutes from "./routes/user.route.js"
import { env } from "./config/env.js"


const app = express()

app.use(helmet(
{    contentSecurityPolicy: false} // j'active en production avec la config adapté 
))
app.use(cors())
 app.use(express.json())

app.use(rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 50
}))



// Limiter les requete par client

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,

    max: 50 ,
    message: {error: "Troe de tentatives, rééssayez plus tard!!"}
})



app.use('/api/auth',authLimiter,  authRoutes)
app.use('/api/users',authLimiter,  userRoutes)


app.use(errorHandle)

export default app
