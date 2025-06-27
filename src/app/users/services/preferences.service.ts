import { Injectable } from '@angular/core';
import { Subscription } from 'rxjs';
import { BaseService } from '../../shared/services/base.service';
import { environment } from '../../../environments/environment';
import { PreferencesResource } from './top-headlines.response';
import { EventBusService } from '../../shared/services/event-bus.service';
@Injectable({ providedIn: 'root' })
export class PreferencesService extends BaseService<PreferencesResource> {
  private subscription: Subscription | null = null;

  constructor(private eventBus: EventBusService) {
    super();
    this.resourceEndpoint = environment.preferencesResourceEndpointPath;
  }
} 