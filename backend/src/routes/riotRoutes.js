const express = require('express');
const router = express.Router();

const {getAccount, getMatchIds, getMatchDetails} = require('../services/riotService')

//SUMMONER ENDPOINT
router.get('/api/summoner/:gameName/:tagLine', async (req, res) => {
    try{

        const {gameName, tagLine} = req.params;
        const data = await getAccount(gameName, tagLine);
        
        res.json(data);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({error: 'Failed to fetch summoner data'});
    }
});

//MATCHES ENDPOINT
router.get('/api/matches/:puuid', async (req, res) => {
    try{

        const {puuid} = req.params;
        const data = await getMatchIds(puuid);

        res.json(data);
    } catch(error){
        console.log(error);
        res.status(500).json({error: 'Failed to fetch match data'});
    }

});

//MATCHID ENDPOINT
router.get('/api/match/:matchId', async (req, res) => {
    try{

        const {matchId} = req.params;
        const data = await getMatchDetails(matchId)
        
        res.json(data)
    } catch(error){
        console.log(error);
        res.status(500).json({error: 'Failed to fetch matchId data'});
    }

});

module.exports = router;