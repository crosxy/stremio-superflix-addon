import { StremioManifest, StremioMetaItem, StremioStream } from '../types/stremio';

const SUPERFLIX_BASE_URL = 'https://superflixapi.dev';
const DEFAULT_HEADERS = { 'Accept': 'application/json', 'User-Agent': 'SuperFlixAddon/1.0' };

export class SuperFlixAddon {
  private manifest: StremioManifest;

  constructor() {
    this.manifest = {
      id: 'dev.superflix.addon',
      version: '1.0.0',
      name: 'SuperFlix Addon',
      description: 'Addon para Stremio que integra com SuperFlixAPI para filmes e séries',
      logo: 'https://superflixapi.dev/logo.png',
      resources: ['catalog', 'meta', 'stream'],
      types: ['movie', 'series'],
      catalogs: [
        { type: 'movie', id: 'superflix-movies', name: 'SuperFlix Filmes', extra: [{ name: 'search', isRequired: false }] },
        { type: 'series', id: 'superflix-series', name: 'SuperFlix Séries', extra: [{ name: 'search', isRequired: false }] }
      ]
    };
  }

  getManifest(): StremioManifest {
    return this.manifest;
  }

  async getCatalog(type: string, id: string, extra: any = {}) {
    const metas: StremioMetaItem[] = [];
    const search = extra.search ? String(extra.search).toLowerCase() : null;

    const list = await this.fetchList(type === 'movie' ? 'movie' : 'serie');

    list.forEach(item => {
      if (search && !item.title?.toLowerCase().includes(search)) return;
      if (type === 'movie') metas.push(this.mapMovie(item));
      else metas.push(this.mapSeries(item));
    });

    return { metas };
  }

  async getMeta(type: string, id: string) {
    const clean = id.replace('sf_movie:', '').replace('sf_series:', '');

    if (type === 'movie') {
      const details = await this.fetchMovie(clean);
      return { meta: this.mapMovie(details) };
    }

    const details = await this.fetchSeries(clean);
    const videos = [];

    (details.seasons || []).forEach(season => {
      season.episodes?.forEach(ep => {
        videos.push({
          id: `${clean}:${season.season_number}:${ep.episode_number}`,
          title: ep.title,
          season: season.season_number,
          episode: ep.episode_number
        });
      });
    });

    const meta = this.mapSeries(details);
    meta.videos = videos;
    return { meta };
  }

  async getStream(type: string, id: string) {
    const clean = id.replace('sf_movie:', '').replace('sf_series:', '');

    if (type === 'movie') {
      return { streams: [{ url: `${SUPERFLIX_BASE_URL}/filme/${clean}`, name: 'SuperFlix', isRemote: true }] };
    }

    const [sid, s, e] = clean.split(':');
    return { streams: [{ url: `${SUPERFLIX_BASE_URL}/serie/${sid}/${s}/${e}`, name: 'SuperFlix', isRemote: true }] };
  }

  // Helpers
  private async fetchList(category: 'movie' | 'serie') {
    const res = await fetch(`${SUPERFLIX_BASE_URL}/lista?category=${category}&format=json`, { headers: DEFAULT_HEADERS });
    return res.json();
  }
  private async fetchMovie(id: string) {
    const r = await fetch(`${SUPERFLIX_BASE_URL}/filme/${id}`, { headers: DEFAULT_HEADERS });
    return r.json();
  }
  private async fetchSeries(id: string) {
    const r = await fetch(`${SUPERFLIX_BASE_URL}/serie/${id}`, { headers: DEFAULT_HEADERS });
    return r.json();
  }

  private mapMovie(it: any): StremioMetaItem {
    return {
      id: `sf_movie:${it.id || it.imdb_id}`,
      type: 'movie',
      name: it.title,
      poster: it.poster,
      background: it.backdrop,
      description: it.description
    };
  }
  private mapSeries(it: any): StremioMetaItem {
    return {
      id: `sf_series:${it.id || it.tmdb_id}`,
      type: 'series',
      name: it.title,
      poster: it.poster,
      background: it.backdrop,
      description: it.description
    };
  }
}
