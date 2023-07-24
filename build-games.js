import { access, mkdir, readFile, writeFile } from 'fs/promises';
import { getOwnedGames, getGameDetails } from './packages/steam-fetch/main.js';

const gamesDir = '.cache/games';
const gamesFile = `${gamesDir}/games.json`;

try {
  await access(gamesDir);
} catch (error) {
  await mkdir(gamesDir, { recursive: true });
}

const cachedGames = await readFile(gamesFile, 'utf-8').catch(() => '[]');

async function cacheGames(games) {
  try {
    await writeFile(gamesFile, JSON.stringify(games, null, 2));
    return games;
  } catch (error) {
    console.log('Error caching games', error);
    return games;
  }
}

export async function getGamesWithDetails() {
  const parsed = JSON.parse(cachedGames);
  if (parsed.length > 0) {
    return JSON.parse(cachedGames);
  }

  // Steam limit of 10 per 10 secinds
  const games = (await getOwnedGames({ sortBy: 'rtime_last_played' })).slice(
    0,
    10
  );

  let gamesWithDetails = [];
  for (const game of games) {
    gamesWithDetails.push(await getGameDetails(game.appid));
  }

  return cacheGames(gamesWithDetails);
}

const gamesWithDetails = await getGamesWithDetails();

writeFile(
  './src/data/games.js',
  `export const games = ${JSON.stringify(gamesWithDetails, null, 2)};`,
  'utf-8'
);
