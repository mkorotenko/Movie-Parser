import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { map, tap, switchMap, shareReplay } from 'rxjs/operators';
import { BehaviorSubject, Subject, empty } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  public reqParameters$ = new BehaviorSubject<any>(undefined);

  private movies$ = this.reqParameters$.asObservable().pipe(
    switchMap((parameters: any) => {
      if (parameters === undefined) {
        return empty();
      } else {
        return this.client.get('api/acc/movies', { params: parameters || { till: 20 } });
      }
    }),
    shareReplay(1)
  );

  public movieCount$ = this.movies$.pipe(
    map((res: any) => res.count)
  );

  public rootContent$ = this.movies$.pipe(
    map((res: { docs: any[] }) => {
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
    })),
    shareReplay(1)
  );

  constructor(
    private client: HttpClient
  ) { }

}
