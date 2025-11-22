require('dotenv').config();

console.log('Key loaded:', process.env.RIOT_API_KEY ? 'Yes' : 'No');


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

async function main(){
    const account = await getAccount('Lenore', 'poex');
    const matchIds = await getMatchIds(account.puuid);
    const matchDetails = await getMatchDetails(matchIds[1]);
    console.log(matchDetails)
}

main()





