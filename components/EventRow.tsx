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

const Sonarr: React.FC<{ event: Sonarr.Event }> = ({ event }) => (
  <div>
    <h3 className="text-sm font-medium">
      <span title={event.eventType}>{emoji[event.eventType]}</span>{' '}
      <strong>{event.series.title}</strong>
    </h3>
    <p className="text-sm text-gray-500">
      {event.episodes &&
        event.episodes.map((episode) => <p>{episode.title}</p>)}
    </p>
  </div>
);

const Radarr: React.FC<{ event: Radarr.Event }> = ({ event }) => (
  <div>
    <h3 className="text-sm font-medium">
      <span title={event.eventType}>{emoji[event.eventType]}</span>{' '}
      <strong>{event.movie.title}</strong>
      {['Download', 'Test', 'Grab'].includes(event.eventType) && (
        <a
          target="_blank"
          href={`https://www.imdb.com/title/${event.remoteMovie.imdbId}`}
        >
          <img src="/imdb.png" className="inline ml-4 h-8 w-8" />
        </a>
      )}
    </h3>
    <p className="text-sm text-gray-500">Dummy</p>
    {event.eventType === 'Download' && (
      <p className="text-sm text-gray-500">{event.movieFile.quality}</p>
    )}
  </div>
);

export const EventRow: React.FC<{ event: Event }> = ({ event }) => {
  return (
    <li key={event.__createdAt.toString()} className="py-4">
      <div className="flex space-x-3">
        <img
          className="h-6 w-6 rounded-full"
          src="https://artworks.thetvdb.com/banners/posters/5d2781b5c9f50.jpg"
          alt=""
        />
        <div className="flex-1 space-y-1">
          <div className="flex items-center justify-between">
            {event.__source === 'sonarr' && <Sonarr event={event} />}
            {event.__source === 'radarr' && <Radarr event={event} />}
            <p className="text-sm text-gray-500 text-right">
              {event.__source}
              <br />
              <TimeAgo date={event.__createdAt} />
            </p>
          </div>
        </div>
      </div>
    </li>
  );
};
