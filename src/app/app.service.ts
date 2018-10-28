import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { map, tap, switchMap } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  public reqParameters$ = new BehaviorSubject<any>({
    rating_gt: 4.8,
    'details.Genre_or': ['Фэнтези', 'Боевик'],
    from: 20,
    till: 20
  });
  public rootContent = this.reqParameters$.asObservable().pipe(
    switchMap((parameters: any) => {
      return this.client.get('api/acc/movies', { params: parameters || { till: 20 } }).pipe(
        map((res: { docs: any[] }) => {
          console.info('res', res);
          const result = res.docs;
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
    })
  );

  constructor(
    private client: HttpClient
  ) { }

}
