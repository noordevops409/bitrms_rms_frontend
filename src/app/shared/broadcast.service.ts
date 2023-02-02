import { Injectable } from '@angular/core';

import { Subject, Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';

interface BroadcastEvent {
  key: any;
  data?: any;
}

@Injectable({
  providedIn: 'root'
})
export class BroadcastService {

  private eventBus: Subject<BroadcastEvent>;
  
  constructor() {
    this.eventBus = new Subject<BroadcastEvent>();
  }

  broadcast(key: any, data?: any) {
    this.eventBus.next({ key, data });
  }

  on<T>(key: any): Observable<T> {
    return this.eventBus.asObservable().pipe(
      filter(event => event.key === key)
    ).pipe(
      // tslint:disable-next-line: no-angle-bracket-type-assertion
      // tslint:disable-next-line: whitespace
      // tslint:disable-next-line: no-angle-bracket-type-assertion
      map(event => <T> event.data)
    );
  }

}
