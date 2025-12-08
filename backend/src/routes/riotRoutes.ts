import express, {Request, Response} from 'express'
const router = express.Router();

import {getAccount, getMatchIds, getMatchDetails, getSummonerByPuuid, getRankedInfo} from '../services/riotService'

// GET SUMMONER BY PUUID (must be before the generic summoner route)
router.get('/api/summoner/by-puuid/:puuid',
    async (req: Request, res: Response) => {
        try {
            const { puuid } = req.params;
            const region = (req.query.region as string) || 'OCE';
            const data = await getSummonerByPuuid(puuid, region);
            res.json(data);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to fetch summoner data' });
        }
})

//SUMMONER ENDPOINT
router.get('/api/summoner/:gameName/:tagLine', async (req: Request, res: Response) => {
    try{

        const {gameName, tagLine} = req.params;
        const region = (req.query.region as string) || 'OCE';
        const data = await getAccount(gameName, tagLine, region);

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
        const region = (req.query.region as string) || 'OCE';
        const data = await getMatchIds(puuid, region);

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
        const region = (req.query.region as string) || 'OCE';
        const data = await getMatchDetails(matchId, region)

        res.json(data)
    } catch(error){
        console.log(error);
        res.status(500).json({error: 'Failed to fetch matchId data'});
    }

})

// GET RANKED INFO BY PUUID
router.get('/api/ranked/:puuid',
    async (req: Request, res: Response) => {
        try {
            const { puuid } = req.params;
            const region = (req.query.region as string) || 'OCE';
            const data = await getRankedInfo(puuid, region);
            res.json(data);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to fetch ranked data' });
        }
});

export default router;
