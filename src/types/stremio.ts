export type StremioManifest = Record<string, any>;

export interface StremioMetaItem {
  id: string;
  type: 'movie' | 'series';
  name: string;
  poster?: string;
  background?: string;
  description?: string;
  year?: string | number;
  genres?: string[];
  imdbRating?: number;
  videos?: any[];
}

export interface StremioStream {
  url: string;
  title?: string;
  name?: string;
  description?: string;
  behaviorHints?: Record<string, any>;
  isRemote?: boolean;
}
