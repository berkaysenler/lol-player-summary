require('dotenv').config()
const express = require('express')
const riotRoutes = require('./routes/riotRoutes')
const app = express()
const PORT = 3000;



app.use(riotRoutes)

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})