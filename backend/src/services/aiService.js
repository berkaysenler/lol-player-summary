require ('dotenv').config()

const OpenAI = require('openai')

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
})

async function getMatchCoaching(playerStats){
    const prompt = `You are a direct, no-nonsense challenger League of legends coach. analyse this match performance and give exactly 3 actioanable tips.
    
    Match Stats:
  - Champion: ${playerStats.championName}
  - Result: ${playerStats.win ? 'Victory': 'Defeat'}
  - KDA: ${playerStats.kills}/${playerStats.deaths}/${playerStats.assists}
  - CS: ${playerStats.totalMinionsKilled + playerStats.neutralMinionsKilled}
  - Damage: ${playerStats.totalDamageDealtToChampions}
  - Vision Score: ${playerStats.visionScore}
  - Gold: ${playerStats.goldEarned}
    
   Format your response as a numbered list (1. 2. 3.) with each tip on a new line.Do not add '*' at the beginning of the tips.`;


    const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [{role: 'user', content: prompt }],
        max_tokens: 200
    })

    return response.choices[0].message.content;
}

module.exports = {getMatchCoaching}