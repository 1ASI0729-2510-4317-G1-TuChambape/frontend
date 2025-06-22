import { Preferences } from '../model/preferences.entity';

export class PreferencesAssembler {
  static toEntityFromResource(resource: any): Preferences {
    return new Preferences(resource);
  }

  static toEntitiesFromResponse(response: any[]): Preferences[] {
    return response.map((pref) => this.toEntityFromResource(pref));
  }

  static toResourceFromEntity(entity: Preferences): any {
    return { ...entity };
  }
} 