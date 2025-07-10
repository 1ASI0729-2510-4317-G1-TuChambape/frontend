import { Injectable } from '@angular/core';
import { BaseService } from '../../shared/services/base.service';
import { User } from '../model/user.entity';
import { environment } from '../../../environments/environment';
import { EventBusService } from '../../shared/services/event-bus.service';
import { AccountRegisteredEvent } from '../../shared/events/account-registered.event';
import { Observable } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class UserService extends BaseService<User> {
  constructor(private eventBus: EventBusService) {
    super();
    this.resourceEndpoint = environment.usersResourceEndpointPath;
    // Inyectar el token Bearer en los headers si existe
    const token = localStorage.getItem('jobconnect_token');
    if (token) {
      this.httpOptions = {
        headers: this.httpOptions.headers.set('Authorization', `Bearer ${token}`)
      };
    }

    // Listener para crear un User cuando se registre una cuenta
    this.eventBus.on<AccountRegisteredEvent>('AccountRegistered').subscribe(event => {
      if (!event || !event.accountId || !event.role) return;
      const user: Partial<User> = { accountId: event.accountId };
      if (event.role === 'customer') {
        user.customerId = undefined; // Se creará después en el flujo de customer
      } else if (event.role === 'worker') {
        user.workerId = undefined; // Se creará después en el flujo de worker
      }
      this.create(user).subscribe();
    });
  }

  // Sobrescribir métodos para incluir el token dinámicamente
  public override getAll(): Observable<Array<User>> {
    const token = localStorage.getItem('jobconnect_token');
    const httpOptions = token ? {
      headers: this.httpOptions.headers.set('Authorization', `Bearer ${token}`)
    } : this.httpOptions;
    return this.http.get<Array<User>>(this.resourcePath(), httpOptions)
      .pipe(retry(2), catchError(this.handleError));
  }

  public override search(params: Record<string, any>): Observable<Array<User>> {
    const searchParams = new URLSearchParams();
    Object.keys(params).forEach((key) => {
      if (params[key] !== null && params[key] !== undefined) {
        searchParams.append(key, params[key].toString());
      }
    });
    const url = `${this.resourcePath()}?${searchParams.toString()}`;
    const token = localStorage.getItem('jobconnect_token');
    const httpOptions = token ? {
      headers: this.httpOptions.headers.set('Authorization', `Bearer ${token}`)
    } : this.httpOptions;
    return this.http.get<Array<User>>(url, httpOptions)
      .pipe(retry(2), catchError(this.handleError));
  }

  public override getById(id: any): Observable<User> {
    const token = localStorage.getItem('jobconnect_token');
    const httpOptions = token ? {
      headers: this.httpOptions.headers.set('Authorization', `Bearer ${token}`)
    } : this.httpOptions;
    return this.http.get<User>(`${this.resourcePath()}/${id}`, httpOptions)
      .pipe(retry(2), catchError(this.handleError));
  }
} 