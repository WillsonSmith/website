import { config } from 'dotenv';
config();

import fetch from 'node-fetch';

const steamApiKey = process.env.STEAM_API_KEY || '';
const steamUserId = process.env.STEAM_USER_ID || '';

if (!steamApiKey || !steamUserId) {
  throw new Error('Missing Steam API Key or User ID');
}

const urlParams = new URLSearchParams({
  key: steamApiKey,
  steamid: steamUserId,
  format: 'json',
});

const ownedGamesEndpoint = `https://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?${urlParams}`;

/**
 * @typedef {Object} getOwnedGamesOptions
 * @property {'playtime_forever' | 'rtime_last_played'} [sortBy]
 */

/**
 *
 * @param {getOwnedGamesOptions} param0
 * @returns
 */

export const getOwnedGames = async ({ sortBy = 'rtime_last_played' }) => {
  const response = await fetch(ownedGamesEndpoint);
  const /** @type {any} */ json = await response.json();
  const games = json?.response?.games || [];
  const sortedGames = games.sort((a, b) => {
    if (a[sortBy] > b[sortBy]) {
      return -1;
    }
    if (a[sortBy] < b[sortBy]) {
      return 1;
    }
    return 0;
  });

  return sortedGames;
};

const GAME_DETAILS_ENDPOINT = 'https://store.steampowered.com/api/appdetails';
export const getGameDetails = async (appId) => {
  const queryParam = new URLSearchParams({ appids: String(appId) });
  const response = await fetch(`${GAME_DETAILS_ENDPOINT}?${queryParam}`);
  const json = await response.json();
  const gameDetails = json?.[appId].data;
  return gameDetails;
};
