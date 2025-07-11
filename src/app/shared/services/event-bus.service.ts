import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class EventBusService {
  private eventSubject = new Subject<{ type: string; payload?: any }>();

  dispatch(eventType: string, payload?: any) {
    this.eventSubject.next({ type: eventType, payload });
  }

  on<T = any>(eventType: string): Observable<T> {
    return this.eventSubject.asObservable()
      .pipe(
        filter(event => event.type === eventType),
        map(event => event.payload as T)
      );
  }
} 