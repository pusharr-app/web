import React from 'react';
import { Event } from '../types/Event';
import { Sonarr } from '../types/Sonarr';
import TimeAgo from 'react-timeago';
import { Radarr } from '../types/Radarr';

const emoji: Record<Sonarr.EventType, string> = {
  Grab: '🤏',
  Download: '💾',
  Rename: '✔️',
  Test: '🧪',
};

const Sonarr: React.FC<{ event: Sonarr.Event }> = ({ event }) => {
  if (event.eventType === 'Rename') return null;
  const ep = event.episodes[0];
  let quality: string;
  if (event.eventType === 'Download') {
    quality = event.episodeFile.quality ?? event.episodes[0].quality ?? '';
  } else {
    quality = event.episodes[0].quality ?? '';
  }
  const seasonEpisode = `S${ep.seasonNumber
    .toString()
    .padStart(2, '0')}E${ep.episodeNumber.toString().padStart(2, '0')} ${
    ep.quality ?? ''
  }`;
  return (
    <tr>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="flex-shrink-0 h-10 w-10">
            <img
              className="h-10 w-10 rounded-full"
              src={`/api/image/sonarr/${event.series.tvdbId}`}
              alt=""
            />
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900">
              {event.series.title}
            </div>
            <div className="text-sm text-gray-500">{seasonEpisode}</div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">{ep.title}</div>
        <div className="text-sm text-gray-500">{quality}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
          {event.eventType}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {event.__source}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        <TimeAgo date={event.__createdAt} />
      </td>
      <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
        <a
          target="_blank"
          href={`https://www.thetvdb.com/?id=${event.series.tvdbId}&tab=series`}
        >
          <img src="/tvdb.png" className="inline ml-4 h-8 w-8" />
        </a>
      </td>
    </tr>
  );
};

const Radarr: React.FC<{ event: Radarr.Event }> = ({ event }) => {
  if (event.eventType === 'Rename') return null;
  let quality: string;
  if (event.eventType === 'Download') {
    quality = event.movieFile.quality;
  } else {
    quality = event.release.quality;
  }
  return (
    <tr>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="flex-shrink-0 h-10 w-10">
            <img
              className="h-10 w-10 rounded-full"
              src={`/api/image/radarr/${event.remoteMovie.imdbId}`}
              alt=""
            />
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900">
              {event.movie.title}
            </div>
            <div className="text-sm text-gray-500">
              {event.remoteMovie.year}
            </div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">{quality}</div>
        <div className="text-sm text-gray-500"></div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
          {event.eventType}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {event.__source}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        <TimeAgo date={event.__createdAt} />
      </td>
      <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
        <a
          target="_blank"
          href={`https://www.imdb.com/title/${event.remoteMovie.imdbId}`}
        >
          <img src="/imdb.png" className="inline ml-4 h-8 w-8" />
        </a>
      </td>
    </tr>
  );
};

const Test: React.FC<{ event: Event }> = ({ event }) => {
  return (
    <tr>
      <td colSpan={4} className="px-6 py-1 whitespace-nowrap">
        <div className="pl-14 text-xs font-medium text-gray-900">
          Test event from {event.__source}
        </div>
      </td>
      <td className="px-6 py-1 whitespace-nowrap text-sm text-gray-500">
        <TimeAgo date={event.__createdAt} />
      </td>
      <td className="px-6 py-1 whitespace-nowrap text-sm text-gray-500">
        <span></span>
      </td>
    </tr>
  );
};

export const EventRow: React.FC<{ event: Event }> = ({ event }) => {
  if (event.eventType === 'Test') {
    return <Test event={event} />;
  }
  if (event.__source === 'sonarr') {
    return <Sonarr event={event} />;
  }
  if (event.__source === 'radarr') {
    return <Radarr event={event} />;
  }
  return null;
};
