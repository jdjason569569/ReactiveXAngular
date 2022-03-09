import { Injectable } from '@angular/core';
import { ajax } from 'rxjs/ajax';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ObsService {

  constructor(private http:HttpClient) { }

  public getGithub(user: string): any {

    const gt = ajax.getJSON(`https://api.github.com/users/${user}`);

    const data$ = new Observable(observer =>{
      gt.subscribe(
        (res)=>{
        observer.next(res);
        observer.complete();
      },
      (error)=>{
        observer.error(error);
      });
    });
    return data$;
  }
}
