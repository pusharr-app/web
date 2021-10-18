import { NextApiRequest, NextApiResponse } from 'next';
import arrayBufferToBuffer from 'arraybuffer-to-buffer';

async function getMovieImage(id: string | number) {
  const res = await fetch(
    `https://api.themoviedb.org/3/find/${id}?api_key=${process.env.TMDB_API_KEY}&language=en-US&external_source=imdb_id`,
  );
  const json = await res.json();
  const path = json.movie_results[0].backdrop_path;
  return `https://image.tmdb.org/t/p/w500${path}`;
}

async function getShowImage(id: string | number) {
  const res = await fetch(
    `https://api.themoviedb.org/3/find/${id}?api_key=${process.env.TMDB_API_KEY}&language=en-US&external_source=tvdb_id`,
  );
  const json = await res.json();
  const path = json.tv_results[0].backdrop_path;
  return `https://image.tmdb.org/t/p/w500${path}`;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.query.params.length < 2) {
    throw new Error('Unknown');
  }
  const [service, id] = req.query.params as string[];
  let url = '';
  if (service === 'sonarr') {
    url = await getShowImage(id);
  }
  if (service === 'radarr') {
    url = await getMovieImage(id);
  }
  if (!url) {
    throw new Error('missing url');
  }
  const imageRes = await fetch(url);
  const blob = await imageRes.blob();

  const ONE_DAY = 60 * 60 * 24;

  res.writeHead(200, {
    'Content-Type': imageRes.headers.get('Content-Type') ?? 'image/jpeg',
    // 'Cache-Control': `max-age=${ONE_DAY}, public`,
  });
  res.end(arrayBufferToBuffer(await blob.arrayBuffer()));
}
