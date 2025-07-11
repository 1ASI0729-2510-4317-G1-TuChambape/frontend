import { Preferences } from '../model/preferences.entity';
import { PreferencesResource, TopHeadlines } from './top-headlines.response';

export class PreferencesAssembler {
  static toEntityFromResource(resource: PreferencesResource): Preferences {
    return new Preferences(resource);
  }

  static toEntitiesFromResponse(response: TopHeadlines<PreferencesResource>): Preferences[] {
    return response.map((pref) => this.toEntityFromResource(pref));
  }

  static toResourceFromEntity(entity: Preferences): PreferencesResource {
    return { ...entity };
  }
} 