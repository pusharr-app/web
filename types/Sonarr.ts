export declare module Sonarr {
  export type EventType = 'Grab' | 'Download' | 'Rename' | 'Test';

  interface Series {
    id: number;
    title: string;
    path: string;
    tvdbId: number;
  }

  interface Episode {
    id: number;
    episodeNumber: number;
    seasonNumber: number;
    title: string;
    airDate?: string;
    airDateUtc?: Date;
    quality: string;
    qualityVersion?: number;
  }

  interface Release {
    quality: string;
    qualityVersion: number;
    size: number;
  }

  interface EpisodeFile {
    id: number;
    relativePath: string;
    path: string;
    quality: string;
    qualityVersion: number;
  }

  interface Base {
    eventType: EventType;
    series: Series;
    __source: 'sonarr';
    __createdAt: Date;
  }

  export interface TestEvent extends Base {
    eventType: 'Test';
    episodes: Episode[];
  }

  export interface GrabEvent extends Base {
    eventType: 'Grab';
    episodes: Episode[];
    release: Release;
  }

  export interface DownloadEvent extends Base {
    eventType: 'Download';
    episodes: Episode[];
    episodeFile: EpisodeFile;
    isUpgrade: boolean;
  }

  export interface RenameEvent extends Base {
    eventType: 'Rename';
  }

  export type Event = TestEvent | GrabEvent | DownloadEvent | TestEvent;
}
