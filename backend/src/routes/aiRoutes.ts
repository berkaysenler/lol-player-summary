import express, {Request, Response} from 'express'


const router = express.Router()
import {getMatchCoaching} from '../services/aiService'

    router.post('/api/coaching', async (req: Request, res: Response) => {

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


export default router