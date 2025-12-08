import redis from '../cache/redis'
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

// Region mappings for different servers
const REGION_CONFIG: { [key: string]: { account: string; match: string; platform: string } } = {
    'OCE': { account: 'americas', match: 'sea', platform: 'oc1' },
    'NA': { account: 'americas', match: 'americas', platform: 'na1' },
    'EUW': { account: 'europe', match: 'europe', platform: 'euw1' },
    'EUNE': { account: 'europe', match: 'europe', platform: 'eun1' },
    'KR': { account: 'asia', match: 'asia', platform: 'kr' },
    'JP': { account: 'asia', match: 'asia', platform: 'jp1' },
    'BR': { account: 'americas', match: 'americas', platform: 'br1' },
    'LAN': { account: 'americas', match: 'americas', platform: 'la1' },
    'LAS': { account: 'americas', match: 'americas', platform: 'la2' },
    'TR': { account: 'europe', match: 'europe', platform: 'tr1' },
    'RU': { account: 'europe', match: 'europe', platform: 'ru' },
};

function getRegionConfig(region: string = 'OCE') {
    return REGION_CONFIG[region.toUpperCase()] || REGION_CONFIG['OCE'];
}

async function getAccount(gameName: string, tagLine: string, region: string = 'OCE'){
    const config = getRegionConfig(region);

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

    const url = `https://${config.account}.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${gameName}/${tagLine}`;
    console.log(`Fetching account from: ${url}`);

    const response = await fetch(url, {
        headers: {
            'X-Riot-Token': process.env.RIOT_API_KEY
        }
    })

    if (!response.ok) {
        const errorBody = await response.text();
        console.error(`Riot API error response:`, errorBody);

        if (response.status === 404) {
            throw new Error(`Summoner "${gameName}#${tagLine}" not found in ${region.toUpperCase()}. Try a different region or check the spelling.`);
        }

        throw new Error(`Riot API error: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json() as RiotAccountData;

    // Validate that we have the required data before inserting
    if (!data.puuid || !data.gameName || !data.tagLine) {
        throw new Error('Invalid summoner data received from Riot API');
    }

    await pool.query('INSERT INTO summoners (puuid, game_name, tag_line) VALUES ($1, $2, $3) ON CONFLICT (puuid) DO NOTHING',
        [data.puuid, data.gameName, data.tagLine]
    )
    return data;

}


async function getMatchIds(puuid: string, region: string = 'OCE'){
    const config = getRegionConfig(region);

    const url = `https://${config.match}.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?start=0&count=20`;
    console.log(`Fetching match IDs from: ${url}`);

    const response = await fetch (url, {
        headers: {
            'X-Riot-Token' : process.env.RIOT_API_KEY
        }
    })

    if (!response.ok) {
        const errorBody = await response.text();
        console.error(`Riot API error response:`, errorBody);
        throw new Error(`Riot API error: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json() as string[];
    console.log(`Match IDs returned: ${data.length} matches`, data);
    return data;
}


async function getMatchDetails(matchId: string, region: string = 'OCE'){
    const config = getRegionConfig(region);

    const cachedMatch = await redis.get(`match:${matchId}`);
    if(cachedMatch){
        console.log(`Cache hit: Redis`);
        return cachedMatch
    }

    const dbResult = await pool.query(
        'SELECT match_data FROM matches WHERE match_id = $1',
        [matchId]
    )
    if(dbResult.rows.length > 0) {
        console.log('Cache hit: PostgreSQL')
        const matchData = dbResult.rows[0].match_data;

        await redis.set(`match:${matchId}`, matchData, {ex: 1800})
        return matchData;
    }

    console.log('Cache miss: Calling Riot API');

    const url = `https://${config.match}.api.riotgames.com/lol/match/v5/matches/${matchId}`;
    console.log(`Fetching match details from: ${url}`);

    const response = await fetch (url, {
        headers: {
            'X-Riot-Token' : process.env.RIOT_API_KEY
        }
    })

    if (!response.ok) {
        const errorBody = await response.text();
        console.error(`Riot API error response:`, errorBody);
        throw new Error(`Riot API error: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json() as MatchData;

    await Promise.all([
        redis.set(`match:${matchId}`, data, {ex: 1800}),

        pool.query(
            'INSERT INTO matches (match_id, match_data) VALUES ($1, $2) ON CONFLICT (match_id) DO NOTHING', [matchId, data]
        )
    ]);

    return data;
}

async function getSummonerByPuuid(puuid: string, region: string = 'OCE'){
    const config = getRegionConfig(region);

    const url = `https://${config.platform}.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/${puuid}`;
    console.log(`Fetching summoner from: ${url}`);

    const response = await fetch (url, {
        headers: {
            'X-Riot-Token': process.env.RIOT_API_KEY
        }
    })

    if (!response.ok) {
        const errorBody = await response.text();
        console.error(`Riot API error response:`, errorBody);
        throw new Error(`Riot API error: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json()
    return data
}

async function getRankedInfo(puuid: string, region: string = 'OCE'){
    const config = getRegionConfig(region);

    const url = `https://${config.platform}.api.riotgames.com/lol/league/v4/entries/by-puuid/${puuid}`;
    console.log(`Fetching ranked info from: ${url}`);

    const response = await fetch(url, {
        headers: {
            'X-Riot-Token': process.env.RIOT_API_KEY
        }
    })

    if (!response.ok) {
        const errorBody = await response.text();
        console.error(`Riot API error response:`, errorBody);
        throw new Error(`Riot API error: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();
    return data;
}

export {getAccount, getMatchIds, getMatchDetails, getRankedInfo, getSummonerByPuuid};
