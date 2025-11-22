require('dotenv').config()

async function getAccount(gameName, tagLine){
    const response = await fetch(`https://americas.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${gameName}/${tagLine}`, {
        headers: {
            'X-Riot-Token': process.env.RIOT_API_KEY
        }
    })

    const data = await response.json();
    return data;
    
}


async function getMatchIds(puuid){
    const response = await fetch (`https://sea.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids`, {
        headers: {
            'X-Riot-Token' : process.env.RIOT_API_KEY
        }
    })
    const data = await response.json();
    return data;
}


async function getMatchDetails(matchId){
    const response = await fetch (`https://sea.api.riotgames.com/lol/match/v5/matches/${matchId}`, {
        headers: {
            'X-Riot-Token' : process.env.RIOT_API_KEY
        }
    })

    const data = await response.json();
    return data;
}

module.exports = { getAccount, getMatchIds, getMatchDetails };
