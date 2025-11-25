const express = require('express')
const router = express.Router()
const {getMatchCoaching} = require('../services/aiService')
    router.post('/api/coaching', async (req, res) => {

        try{
            const playerStats = req.body;
            const coaching = await getMatchCoaching(playerStats)
            res.json({coaching})
        }
        catch(error){
            console.error(error);
            res.status(500).json({error: 'Failed to generate coaching'})
        }
    })


module.exports = router;