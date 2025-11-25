require('dotenv').config()
const express = require('express')
const cors = require('cors')
const aiRoutes = require('./routes/aiRoutes')
const riotRoutes = require('./routes/riotRoutes')
const app = express()
const PORT = 3001;



app.use(cors())
app.use(express.json())
app.use(riotRoutes)
app.use(aiRoutes)

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})