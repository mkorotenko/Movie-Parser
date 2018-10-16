import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  public rootContent = this.client.get('api/acc/movies?rating_gt=4.8&details.Genre_or=Фэнтези,Боевик&till=20').pipe(
    map((res: any[]) => {
      const result = res;
      result.sort((a, b) => b.rating - a.rating);
      return result;
    }),
    map((res: any[]) => res.map((e: { details: any, imgSrc: string }) => {
      const { details, imgSrc, ...props} = e;
      return {
        ...props,
        genre: details.Genre && details.Genre.join(','),
        quality: details.Quality && details.Quality.join(','),
        year: details.Year && details.Year.join(','),
        img: imgSrc && imgSrc.split('/').pop()
      };
    }))
  );

  constructor(
    private client: HttpClient
  ) { }

}
