import { HttpService, Injectable } from '@nestjs/common';

import { GotService } from './got.service';
import { StringService } from './string.service';

interface Movie {
  title: string;
  url: string;
  thumbnail: string;
  isMovieTrailer: boolean;
  isMovieSeries: boolean;
}

@Injectable()
export class MoviesService {
  constructor(
    private gotService: GotService,
    private stringService: StringService,
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
  async search(q: string) {
    const searchString = this.stringService.nonAccentVietnamese(q);
    let episode: any = null;
    let search = searchString;

    if (searchString.indexOf('tap') !== -1) {
      const searchParts = searchString.split('tap');
      episode = parseInt(searchParts[1].trim());
      search = searchParts[0];
    }
    try {
      const $ = await this.gotService.get(
        `https://phephimz.net/tim-kiem?q=${search}`,
      );

      const movies = $('#slide-episodes')
        .find(' > div')
        .map((i: any, elem: any) => {
          const url = $(elem).find('a.film-title').attr('href');
          const title = $(elem).find('a.film-title').text();
          const subText = $(elem).find('div.film-tag > .sub').text();
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

          const isMovieTrailer =
            this.stringService
              .nonAccentVietnamese(subText)
              .indexOf('trailer') !== -1;

          return { url, title, thumbnail, isMovieSeries, isMovieTrailer };
        })
        .get()
        .filter(
          (e: Movie) =>
            typeof e !== 'undefined' &&
            e.title !== '' &&
            !e.isMovieTrailer &&
            e.isMovieSeries === (episode !== null),
        );

      return Promise.all(
        movies.map(async (movie: Movie) => {
          const vid = await this.getEpisode(movie.url, episode);
          if (vid?.data !== null) {
            const vod = 2;
            const m3u8Url = `${vid.host}/vod/v${vod}//packaged:mp4/${vid.mid}/playlist.m3u8`;
            return {
              title:
                episode !== null
                  ? `${movie.title} - Tập ${episode}`
                  : movie.title,
              thumbnail: movie.thumbnail,
              url: m3u8Url,
              cdn: vid.host,
            };
          }
        }),
      );
    } catch (err) {
      return err.message;
    }
  }
}
