require ('dotenv').config()

const OpenAI = require('openai')

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
})

async function getMatchCoaching(matchData){
    const player = matchData.player;
      const match = matchData.match;

      // Get team comps
      const playerTeam = match.info.participants.filter(p => p.teamId === player.teamId);
      const enemyTeam = match.info.participants.filter(p => p.teamId !== player.teamId);

      // Get objectives
      const playerTeamData = match.info.teams.find(t => t.teamId ===  player.teamId);
      const enemyTeamData = match.info.teams.find(t => t.teamId !== player.teamId);

      const prompt = `You are a challenger 
        League of Legends coach analyzing a 
        match. Provide exactly 3 specific, 
        actionable tips for improvement.

        **Player Performance:**
        - Champion: ${player.championName}
        - Result: ${player.win ? 'Victory' : 'Defeat'}
        - KDA: ${player.kills}/${player.deaths}/${player.assists}
        - CS: ${player.totalMinionsKilled + player.neutralMinionsKilled}
        - Damage: ${player.totalDamageDealtToChampions}
        - Vision Score: ${player.visionScore}
        - Gold: ${player.goldEarned}

        Team Composition:
        Your Team: ${playerTeam.map(p => p.championName).join(', ')}
        Enemy Team: ${enemyTeam.map(p => p.championName).join(', ')}

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
        max_tokens: 200
    })

    return response.choices[0].message.content;
}

module.exports = {getMatchCoaching}