import { inject, Injectable } from '@angular/core';
import { Observable, forkJoin, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { UserService } from './user.service';
import { WorkerService } from './worker.service';
import { CustomerService } from './customer.service';
import { Worker } from '../model/worker.entity';
import { Customer } from '../model/customer.entity';
import { User } from '../model/user.entity';
import { UserSessionService } from './user-session.service';

@Injectable({
  providedIn: 'root'
})
export class UserProfileService {
  constructor(private userSessionService: UserSessionService) { }

  userService = inject(UserService);
  workerService = inject(WorkerService);
  customerService = inject(CustomerService);

  getUserProfile(userId: number): Observable<Worker | Customer | null> {
    return this.userService.getById(userId).pipe(
      switchMap((user: User | null) => {
        if (!user) return of(null);
        if (user.workerId) return this.workerService.getById(user.workerId);
        if (user.customerId) return this.customerService.getById(user.customerId);
        return of(null);
      })
    );
  }

  getUserProfileByEmail(email: string): Observable<Worker | Customer | null> {
    // Busca en workers y customers por email
    return forkJoin([
      this.workerService.search({ email }),
      this.customerService.search({ email })
    ]).pipe(
      map(([workers, customers]) => {
        if (workers.length > 0) return workers[0];
        if (customers.length > 0) return customers[0];
        return null;
      })
    );
  }

  updateUserProfile(userId: number, updateData: Partial<Worker> | Partial<Customer>): Observable<Worker | Customer | null> {
    return this.userService.getById(userId).pipe(
      switchMap((user: User | null) => {
        if (!user) return of(null);
        if (user.workerId) return this.workerService.update(user.workerId, updateData as Partial<Worker>);
        if (user.customerId) return this.customerService.update(user.customerId, updateData as Partial<Customer>);
        return of(null);
      })
    );
  }
} 