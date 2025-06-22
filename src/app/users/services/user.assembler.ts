import { User } from '../model/user.entity';
import { UserResource, TopHeadlines } from './top-headlines.response';

export class UserAssembler {
  static toEntityFromResource(resource: UserResource): User {
    return new User(resource);
  }

  static toEntitiesFromResponse(response: TopHeadlines<UserResource>): User[] {
    return response.map((user) => this.toEntityFromResource(user));
  }
} 