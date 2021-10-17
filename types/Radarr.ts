export declare module Radarr {
  export type EventType = 'Grab' | 'Download' | 'Rename' | 'Test';

  type Date = string;

  interface Movie {
    id: number;
    title: string;
    releaseDate: string;
  }

  interface RemoteMovie {
    tmdbId: number;
    imdbId: string;
    title: string;
    year: number;
  }

  interface Release {
    quality: string;
    qualityVersion: number;
    releaseGroup: string;
    releaseTitle: string;
    indexer: string;
    size: number;
  }

  interface MovieFile {
    id: number;
    relativePath: string;
    path: string;
    quality: string;
    qualityVersion: number;
    releaseGroup: string;
  }

  interface Base {
    eventType: EventType;
    movie: Movie;
    __source: 'radarr';
    __createdAt: Date;
  }

  export interface TestEvent extends Base {
    eventType: 'Test';
    remoteMovie: RemoteMovie;
    release: Release;
  }

  export interface GrabEvent extends Base {
    eventType: 'Grab';
    remoteMovie: RemoteMovie;
    release: Release;
  }

  export interface DownloadEvent extends Base {
    eventType: 'Download';

    remoteMovie: RemoteMovie;
    movieFile: MovieFile;
    isUpgrade: boolean;
  }

  export interface RenameEvent extends Base {
    eventType: 'Rename';
  }

  export type Event = TestEvent | GrabEvent | DownloadEvent | RenameEvent;
}
