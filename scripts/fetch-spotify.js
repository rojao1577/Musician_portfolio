import 'dotenv/config';
import { writeFileSync, mkdirSync, existsSync, readFileSync } from 'fs';

const CLIENT_ID     = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const ARTIST_ID     = '57fhuFj04oOUicfQCrUQVZ';

const TRACK_IDS = [
  '3GwsPY8HRsUdDu2ViAmrlP', // Chuva de Diamantes
  '5vDpBrMS1ZupNYUnBVcexm', // carta de desabafo
  '490NVzfgYnVyLPbpe7ZaOm', // anomalia cósmica
  '1iJCU8SwT9Rgqp2mE9z7hm', // Olha pra mim
  '73pg6bw2oobBVfyZmSRYtK', // mentiras covardes
];

async function getToken() {
  const creds = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64');
  const res = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${creds}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Token request failed: ${res.status}\n${body}`);
  }
  const { access_token } = await res.json();
  return access_token;
}

function msToMinSec(ms) {
  const total = Math.round(ms / 1000);
  const min   = Math.floor(total / 60);
  const sec   = String(total % 60).padStart(2, '0');
  return `${min}:${sec}`;
}

async function run() {
  if (!CLIENT_ID?.trim() || !CLIENT_SECRET?.trim()) {
    console.error('Missing or empty SPOTIFY_CLIENT_ID or SPOTIFY_CLIENT_SECRET in .env');
    process.exit(1);
  }

  console.log('Fetching Spotify token...');
  const token   = await getToken();
  const headers = { Authorization: `Bearer ${token}` };

  // Spotify removed preview_url from their Web API in 2023.
  // Fetch individual track metadata sequentially; previewUrl must be provided manually.
  console.log('Fetching track metadata...');
  const rawTracks = [];
  for (const id of TRACK_IDS) {
    const res = await fetch(`https://api.spotify.com/v1/tracks/${id}`, { headers });
    if (!res.ok) {
      console.warn(`  Skipping track ${id}: request failed (${res.status})`);
      continue;
    }
    rawTracks.push(await res.json());
  }

  // Preserve manually-set previewUrl values from the existing JSON
  const existingPreviewUrls = {};
  if (existsSync('data/spotify.json')) {
    try {
      const existing = JSON.parse(readFileSync('data/spotify.json', 'utf8'));
      (existing.tracks || []).forEach((t) => {
        if (t.id && t.previewUrl) existingPreviewUrls[t.id] = t.previewUrl;
      });
    } catch (_) {}
  }

  const tracks = rawTracks.map((t) => ({
    id:         t.id,
    title:      t.name,
    album:      t.album.name,
    year:       t.album.release_date.slice(0, 4),
    duration:   msToMinSec(t.duration_ms),
    spotifyUrl: t.external_urls.spotify,
    cover:      t.album.images[0]?.url ?? null,
    previewUrl: existingPreviewUrls[t.id] ?? null,
  }));

  tracks.forEach((t) => console.log(`  ${t.title} [${t.id}]`));

  console.log('Fetching albums...');
  const albumsRes = await fetch(
    `https://api.spotify.com/v1/artists/${ARTIST_ID}/albums?include_groups=album,single`,
    { headers }
  );
  if (!albumsRes.ok) {
    const body = await albumsRes.text();
    throw new Error(`Albums request failed: ${albumsRes.status}\n${body}`);
  }
  const albumsData = await albumsRes.json();

  if (!Array.isArray(albumsData.items)) {
    throw new Error('Unexpected albums response shape — missing items array');
  }
  if (albumsData.total > albumsData.items.length) {
    console.warn(`Warning: artist has ${albumsData.total} releases but only ${albumsData.items.length} were fetched (pagination limit)`);
  }

  const releases = albumsData.items.map((a) => ({
    id:         a.id,
    title:      a.name,
    year:       a.release_date.slice(0, 4),
    type:       a.album_type,
    cover:      a.images[0]?.url ?? null,
    spotifyId:  a.id,
    spotifyUrl: a.external_urls.spotify,
    trackCount: a.total_tracks,
  }));

  mkdirSync('data', { recursive: true });
  writeFileSync('data/spotify.json', JSON.stringify({ tracks, releases }, null, 2));

  console.log(`Done: ${tracks.length} tracks, ${releases.length} releases → data/spotify.json`);
}

run().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
