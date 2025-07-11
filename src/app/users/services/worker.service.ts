import { Injectable } from '@angular/core';
import { BaseService } from '../../shared/services/base.service';
import { Worker } from '../model/worker.entity';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class WorkerService extends BaseService<Worker> {
  constructor() {
    super();
    this.resourceEndpoint = `/users${environment.workersResourceEndpointPath}`;
  }

  getWorkerById(id: number): Observable<Worker> {
    const token = localStorage.getItem('jobconnect_token');
    return this.getById(id, token!);
  }
} 