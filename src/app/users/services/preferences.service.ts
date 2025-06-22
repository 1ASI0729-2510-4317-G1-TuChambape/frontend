import { Injectable } from '@angular/core';
import { BaseService } from '../../shared/services/base.service';
import { Preferences } from '../model/preferences.entity';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class PreferencesService extends BaseService<Preferences> {
  constructor() {
    super();
    this.resourceEndpoint = environment.preferencesResourceEndpointPath;
  }
} 