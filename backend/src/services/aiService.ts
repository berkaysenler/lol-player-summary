import redis from '../cache/redis'
import pool from '../db/index'
import 'dotenv/config'

import OpenAI from 'openai' 

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
})

async function getMatchCoaching(matchData: any){
      const player = matchData.player;
      const match = matchData.match;
      const matchId = match.metadata.matchId;
      const puuid = player.puuid;

      const cacheKey = `coaching:${matchId}:${puuid}`;
      const cachedCoaching = await redis.get(cacheKey);
      if(cachedCoaching){
        console.log('Coaching cache hit: Redis');
      }



      const dbResult = await pool.query(
        'SELECT coaching_text FROM coaching WHERE match_id = $1 AND puuid = $2',
        [matchId, puuid]
      )
      if(dbResult.rows.length > 0){
        console.log('Coaching cache hit: PostgreSQL');
        const coachingText =  dbResult.rows[0].coaching_text;

        await redis.set(cacheKey, coachingText, {ex: 3600});
        return coachingText;
      }
      console.log('Coaching cache miss: Calling OpenAI');

      // Get team comps
      const playerTeam = match.info.participants.filter((p:any) => p.teamId === player.teamId);
      const enemyTeam = match.info.participants.filter((p:any) => p.teamId !== player.teamId);

      // Get objectives
      const playerTeamData = match.info.teams.find((t:any) => t.teamId ===  player.teamId);
      const enemyTeamData = match.info.teams.find((t:any) => t.teamId !== player.teamId);

      const prompt = `You are a challenger 
        League of Legends coach analyzing a 
        match. Provide exactly 3 specific, 
        actionable tips for improvement.

        Player Performance:
        - Champion: ${player.championName}
        - Result: ${player.win ? 'Victory' : 'Defeat'}
        - KDA: ${player.kills}/${player.deaths}/${player.assists}
        - CS: ${player.totalMinionsKilled + player.neutralMinionsKilled}
        - Damage: ${player.totalDamageDealtToChampions}
        - Vision Score: ${player.visionScore}
        - Gold: ${player.goldEarned}

        Team Composition:
        Your Team: ${playerTeam.map((p:any) => p.championName).join(', ')}
        Enemy Team: ${enemyTeam.map((p:any) => p.championName).join(', ')}

        Objectives:
        Your Team - Dragons: ${playerTeamData.objectives.dragon.kills}, Baron: ${playerTeamData.objectives.baron.kills}, 
        Towers: ${playerTeamData.objectives.tower.kills}
        Enemy Team - Dragons: ${enemyTeamData.objectives.dragon.kills}, Baron: ${enemyTeamData.objectives.baron.kills}, 
        Towers: ${enemyTeamData.objectives.tower.kills}

        Analyze this match considering team 
        compositions, objective control, and 
        individual performance. Format your 
        response as a numbered list (1. 2. 3.) 
        with each tip on a new line. Avoid using '**'`;


    const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [{role: 'user', content: prompt }],
        max_tokens: 400
    })

    const coachingText = response.choices[0].message.content;

    await Promise.all([redis.set(cacheKey, coachingText, {ex: 3600}), 
        pool.query('INSERT INTO coaching (match_id, puuid, coaching_text) VALUES ($1, $2, $3)',
        [matchId, puuid, coachingText]
        )
    ])


    return coachingText;    
}

export {getMatchCoaching}
