import pool from '../db/index'
import 'dotenv/config'

interface RiotAccountData {
    puuid: string;
    gameName: string;
    tagLine: string;
}

interface MatchData {
    metadata: any;
    info: any
}

async function getAccount(gameName: string, tagLine: string){
    const dbResult = await pool.query(
        'SELECT * FROM summoners WHERE game_name = $1 AND tag_line = $2',
        [gameName, tagLine]
    )
    if (dbResult.rows.length > 0 ){
        const summoner = dbResult.rows[0];
        return {
            puuid: summoner.puuid,
            gameName: summoner.game_name,
            tagLine: summoner.tag_line
        }
    }
    const response = await fetch(`https://americas.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${gameName}/${tagLine}`, {
        headers: {
            'X-Riot-Token': process.env.RIOT_API_KEY
        }
    })

    const data = await response.json() as RiotAccountData;

    await pool.query('INSERT INTO summoners (puuid, game_name, tag_line) VALUES ($1, $2, $3) ON CONFLICT (puuid) DO NOTHING',
        [data.puuid, data.gameName, data.tagLine]
    )
    return data;
    
}


async function getMatchIds(puuid: string){

    

    const response = await fetch (`https://sea.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids`, {
        headers: {
            'X-Riot-Token' : process.env.RIOT_API_KEY
        }
    })
    const data = await response.json();
    return data;
}


async function getMatchDetails(matchId: string){

    const dbResult = await pool.query(
        'SELECT match_data FROM matches WHERE match_id = $1',
        [matchId]
    )
    if(dbResult.rows.length > 0) {
        return dbResult.rows[0].match_data
    }
    
    
    const response = await fetch (`https://sea.api.riotgames.com/lol/match/v5/matches/${matchId}`, {
        headers: {
            'X-Riot-Token' : process.env.RIOT_API_KEY
        }
    })

    const data = await response.json() as MatchData;
    await pool.query(
        'INSERT INTO matches (match_id, match_data) VALUES ($1, $2) ON CONFLICT (match_id) DO NOTHING', [matchId, data]
    )
    return data;
}
export {getAccount, getMatchIds, getMatchDetails};
