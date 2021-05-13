import { HttpService, Injectable } from '@nestjs/common';
import { GotHelper, StringHelper } from 'src/common/helpers';

import { Movie } from './interfaces/movie.interface';

@Injectable()
export class MoviesService {
  constructor(
    private gotService: GotHelper,
    private stringService: StringHelper,
    private httpService: HttpService,
  ) {}

  async getEpisode(url: string, episode: number | boolean): Promise<any> {
    let path = 'xem-phim.html';
    if (episode) {
      path = `tap-${episode}.html`;
    }
    const response = await this.httpService.get(`${url}/${path}`).toPromise();
    const dom = response.data;
    const arr = dom.match(/var EpisodeID = (.*);/);
    if (!arr || !arr[1]) {
      return null;
    }
    const episodeId = parseInt(arr[1]);
    const videoUrl = `https://phephim.xyz/api/getvinfo?callback=json&vid=${episodeId}`;
    const videoResponse = await this.httpService.get(videoUrl).toPromise();
    return videoResponse.data &&
      videoResponse.data.code === 0 &&
      videoResponse.data.data
      ? {
          host: videoResponse.data.data.host,
          mid: videoResponse.data.data.mid,
        }
      : {
          host: null,
          mid: null,
        };
  }

  /**
   *
   * @param q string
   * @returns Promise<any>
   */
  async search(q: string, smartSearch: boolean | string) {
    const searchString = this.stringService.nonAccentVietnamese(q);
    let episode: any = null;
    let search = searchString;
    const isSmartSearch = smartSearch === true || smartSearch === 'true';

    if (searchString.indexOf('tap') !== -1) {
      const searchParts = searchString.split('tap');
      episode = parseInt(searchParts[1].trim());
      search = searchParts[0];
    }

    try {
      const $ = await this.gotService.get(
        `https://phephimz.net/tim-kiem?q=${search}`,
      );

      let movies = $('#slide-episodes')
        .find(' > div')
        .map((i: any, elem: any) => {
          const url = $(elem).find('a.film-title').attr('href');
          const title = $(elem).find('a.film-title').text();
          const titleEng = $(elem).find('a.film-title').next().text();
          const subText = $(elem).find('div.film-tag > .sub').text();
          let lastEpisode = null;
          let thumbnail = $(elem)
            .find('a.film-cover > .poster')
            .css('background-image');

          if (thumbnail) {
            thumbnail = thumbnail
              .replace('url(', '')
              .replace(')', '')
              .replace(/\"/gi, '');
          }
          const isMovieSeries =
            this.stringService.nonAccentVietnamese(subText).indexOf('tap') !==
            -1;

          if (isMovieSeries) {
            lastEpisode = parseInt(
              this.stringService.nonAccentVietnamese(subText).match(/\d+/)[0],
            );
          }

          const isMovieTrailer =
            this.stringService
              .nonAccentVietnamese(subText)
              .indexOf('trailer') !== -1;

          return {
            url,
            title,
            titleEng,
            thumbnail,
            isMovieSeries,
            isMovieTrailer,
            lastEpisode,
          };
        })
        .get()
        .filter(
          (e: any) =>
            typeof e !== 'undefined' && e.title !== '' && !e.isMovieTrailer,
        );

      // If query string does not contains 'tap' or this request is not smart search
      if (episode === null && !isSmartSearch) {
        movies = movies.filter((e: any) => e.isMovieSeries !== true);
      }

      return Promise.all(
        movies.map(
          async (movie: any): Promise<Movie> => {
            const currentEpisode = episode
              ? episode
              : movie.lastEpisode
              ? movie.lastEpisode
              : null;
            const vid = await this.getEpisode(movie.url, currentEpisode);
            if (vid !== null && vid.data !== null) {
              const vod = 2;
              const m3u8Url = `${vid.host}/vod/v${vod}/packaged:mp4/${vid.mid}/playlist.m3u8`;
              return {
                title:
                  episode !== null
                    ? `${movie.title} - Tập ${episode}`
                    : movie.title,
                titleEng:
                  episode !== null
                    ? `${movie.titleEng} - Episode ${episode}`
                    : movie.titleEng,
                thumbnail: movie.thumbnail,
                url: m3u8Url,
                cdn: vid.host,
                currentEpisode: currentEpisode,
                lastEpisode: movie.lastEpisode,
                isMovieSeries: movie.isMovieSeries,
                isMovieTrailer: movie.isMovieTrailer,
              };
            }
          },
        ),
      );
    } catch (err) {
      return err.message;
    }
  }
}
