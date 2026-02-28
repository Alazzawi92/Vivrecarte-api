import express from "express"
import cors from "cors"
import helmet from "helmet"
import rateLimit from "express-rate-limit"
import authRoutes from "./routes/auth.route.js"
import { errorHandle } from "./middlewares/error.middleware.js"


const app = express()

app.use(helmet())
app.use(cors())
app.use(express.json())

app.use(rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 50
}))


app.use('/api/auth', authRoutes)


app.use(errorHandle)

export default app
