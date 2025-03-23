import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class TmdbService {
    private readonly apiUrl;
    private readonly apiKey;

    constructor(private readonly httpService: HttpService, private readonly configService: ConfigService) {
        this.apiUrl = configService.get<string>('TMDB_API_URL');
        this.apiKey = configService.get<string>('TMDB_API_KEY');
    }

    async getPopularMovies(page: number = 1) {
        const url = `${this.apiUrl}/discover/movie?api_key=${this.apiKey}&page=${page}&sort_by=popularity.desc`;
            return (await firstValueFrom(this.httpService.get(url))).data;
    }
}
