require('dotenv').config()
const express = require('express')
const cors = require('cors')
const riotRoutes = require('./routes/riotRoutes')
const app = express()
const PORT = 3001;



app.use(cors())
app.use(riotRoutes)

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})