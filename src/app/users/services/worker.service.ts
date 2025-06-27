import { Injectable } from '@angular/core';
import { BaseService } from '../../shared/services/base.service';
import { Worker } from '../model/worker.entity';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class WorkerService extends BaseService<Worker> {
  constructor() {
    super();
    this.resourceEndpoint = environment.workersResourceEndpointPath;
  }

  getWorkerById(id: number): Observable<Worker> {
    return this.getById(id);
  }
} 