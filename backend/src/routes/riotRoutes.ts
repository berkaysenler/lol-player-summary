import express, {Request, Response} from 'express'
const router = express.Router();

import {getAccount, getMatchIds, getMatchDetails} from '../services/riotService'

//SUMMONER ENDPOINT
router.get('/api/summoner/:gameName/:tagLine', async (req: Request, res: Response) => {
    try{

        const {gameName, tagLine} = req.params;
        const data = await getAccount(gameName, tagLine
        );
        
        res.json(data);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({error: 'Failed to fetch summoner data'});
    }
});

//MATCHES ENDPOINT
router.get('/api/matches/:puuid', async (req: Request, res: Response) => {
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
router.get('/api/match/:matchId', async (req: Request, res: Response) => {
    try{

        const {matchId} = req.params;
        const data = await getMatchDetails(matchId)
        
        res.json(data)
    } catch(error){
        console.log(error);
        res.status(500).json({error: 'Failed to fetch matchId data'});
    }

});

export default router;