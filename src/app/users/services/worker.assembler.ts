import { Worker } from '../model/worker.entity';
import { WorkerResource, TopHeadlines } from './top-headlines.response';

export class WorkerAssembler {
  static toEntityFromResource(resource: WorkerResource): Worker {
    return new Worker(resource);
  }

  static toEntitiesFromResponse(response: TopHeadlines<WorkerResource>): Worker[] {
    return response.map((worker) => this.toEntityFromResource(worker));
  }
} 