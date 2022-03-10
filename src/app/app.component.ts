import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { Observable,Subject } from 'rxjs';
import { ajax } from 'rxjs/ajax';
import {interval, fromEvent, pipe, of, timer, range, concat, forkJoin} from 'rxjs';
import {map, filter, tap, share,mapTo, take, bufferTime, switchMap, delay, concatMap, mergeMap} from 'rxjs/operators';
import { ObsService } from './services/obs.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'observable-subscripcion';
  message:string = '';

  constructor(private obsService: ObsService){
    this.getUpdatedMessage();
  }

  public ngOnInit(): void {
    //this.observableSubscribe();
    //this.fromEvent();
    //this.mapAndFilter();
    //this.tap();
    //this.share();
    //this.concat();
    //this.observableCicle();
    //this.bufferTime();
    //this.switchMap();
    //this.forkJoin();
    //this.concatMap();
    //this.mergeMap();
    //this.multiplesSubscripciones();
    this.subjects();
  }
  observableSubscribe(){
    const contador = interval(1000);

    contador.subscribe((n)=>{
       console.log(`cada ${n} segundos`);
    });
  }
  //fromEvent : convierte una variable en observable a travez de un evento de javascript
               //mouseclick, mouseOver, keypress
  fromEvent(){
      const el:any = document.getElementById('elemento'); 

      const mouseMove = fromEvent(el , 'mousemove');

      mouseMove.subscribe((e: any)=>{
        console.log(`x ->${e.clientX} , Y ->${e.clientY}`);
      })



  }
  //OPERADORES: operaciones que se pueden realizar sobre distintos elementos de una subscripcion
  //Map: realiza operacion matematica 
  //Filter: filtra informacion de la data
  mapAndFilter(){
    const nums = of(1,2,3,4,5,6,7,8,9); //retorna un observable
    //METODO 1
    // const alCuadrado = pipe(
    //   filter((n: number) => n % 2 === 0),
    //   map(n => n * n)
    // );
    // const cuadrado = alCuadrado(nums);
    // cuadrado.subscribe(x => console.log(x));
    //METODO 2
    nums.pipe(
      filter((n: number) => n % 2 === 0),
      map(n => n * n)
    ).subscribe(x => console.log(x));
  }
  //TAP: 
  tap(){
     const clicks = fromEvent(document, 'click');
     const positions = clicks.pipe(
       tap(ev => console.log('Procesado', ev),
       error=> console.log(error),
       ()=> console.log('COmpletado'))
     );

     positions.subscribe();
  }
  //Share: Permite compartir un observable entre dos o mas subscripciones
  share(){
    const time = timer(1000);
    const obs = time.pipe(
      tap(()=> console.log('TAP ON')),
      mapTo('END OBS')
    );
    //const subs1 = obs.subscribe(val => console.log(val));
    //const subs2 = obs.subscribe(val => console.log(val));

    const shareObs = obs.pipe(share());
    console.log('SHARE ON');  //COmparte un solo valor para los diferentes subscripciones
    const subs3 = shareObs.subscribe(val => console.log(val));
    const subs4 = shareObs.subscribe(val => console.log(val));
    const subs5 = shareObs.subscribe(val => console.log(val));
    const subs6 = shareObs.subscribe(val => console.log(val));
    const subs7 = shareObs.subscribe(val => console.log(val));
    const subs8 = shareObs.subscribe(val => console.log(val));

  }
  //concat: concatena dos o mas observables
  //take: multiplica por el numero de veces un observable
  concat(){
     const timer = interval(1000).pipe(take(2));
     const rango = range(1,10);

     const result = concat(rango, timer);
     result.subscribe(x => console.log(x));
  }
  observableCicle(){
    const myObservable = new Observable( observer => {
      observer.next(1);
      observer.next(2);
      observer.next(3);
      observer.complete();
    });

    const subs = myObservable.subscribe({
      next: x=> console.log('El sigueinte valor es =>', x),
      error: error => console.log('Error =>', error),
      complete: ()=> console.log('Subscripcion complete')
    });

    subs.unsubscribe();
  }
  //BufferTime : Va a almacenar datos en un array hasta que se cumpla una condicion
  bufferTime(){
    const timer = interval(500);   //Observable interval con medio segundo de n valores
    const buffer = timer.pipe(bufferTime(1000)); //Almacena durante dos segundos lo que se que traiga el observer asociado
    
    // timer.subscribe((value)=>{
    //   console.log('value -> ',value);
    // });
    buffer.subscribe((value)=>{  
      console.log('buffer -> ',value);
    });
  }
  //SwitchMap: 
  switchMap(){
  fromEvent(document, 'click')
  .pipe(switchMap(()=> interval(1000))).subscribe(console.log);
  }
  //ForkJoin: operador de combinacion, permite combinar un numero limitado de observables y al final emitir los ultimos valores
  // de las observables
  forkJoin(){
    //EJemplo 1
     const fork = forkJoin([
       of('hola',2),
       of('mundo', 10),
       of('como estas').pipe(delay(2000))]);

     fork.subscribe((value)=>{
       console.log(value);
     });
  }
  //concatMap : concatena valores de un observable y los mapea en el orden que viene
  concatMap(){
    const source = of(5000, 1000, 500);

    const obsConcatmap = source.pipe(
      concatMap(v => of(`Valor : ${v}`).pipe(delay(v)))
    )
    obsConcatmap.subscribe((value)=>{
      console.log(value);
    });

  }
  //mergeMap:  concatena valores de un observable y los mapea en cualquier orden
  mergeMap(){
    const source = of(5000, 1000, 500);

    const obsMergeMap = source.pipe(
      mergeMap(v => of(`Valor : ${v}`).pipe(delay(v)))
    )
    obsMergeMap.subscribe((value)=>{
      console.log(value);
    });
  }

  multiplesSubscripciones(){
    //Observables en paralelo
    forkJoin([
      this.obsService.getGithub('jdjason569569'),
      this.obsService.getGithub('jdjason')
    ]).subscribe((value)=>{
      console.log(value);
    });

    //Observables que depende del anterior (En serie)
    this.obsService.getGithub('jdjason569569').pipe(
      mergeMap((res: any) => ajax(res.blog)),
    ).subscribe((final: any)=>{
      console.log(final.status);
    });

  }

  //Subject: observable que puede obtener multiples subscripciones
  subjects(){
    //Ejemplo1
    // const subject = new Subject<number>();

    // subject.subscribe({
    //   next: (n: any) => console.log(`${n}`)
    // });

    // subject.subscribe({
    //   next: (n: any) => console.log(`${n + 1}`)
    // });
    // subject.next(1);
    // subject.next(2);

    //Ejemplo2
    //getUpdatedMessage();
    //setMessage();


  }
  getUpdatedMessage() {
    this.obsService.messageSubject.subscribe((res) => {
        this.message = res;
      }
    )
  }

  setMessage() {
    let message = (<HTMLInputElement>document.getElementById("message")).value;
    this.obsService.setMessage(message);
  }

}
