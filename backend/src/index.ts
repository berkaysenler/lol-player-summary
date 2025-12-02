import 'dotenv/config';
import express  from 'express'
import cors  from 'cors'
import aiRoutes  from './routes/aiRoutes'
import riotRoutes  from './routes/riotRoutes'

const app = express()
const PORT = 3001;



app.use(cors())
app.use(express.json())
app.use(riotRoutes)
app.use(aiRoutes)

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})