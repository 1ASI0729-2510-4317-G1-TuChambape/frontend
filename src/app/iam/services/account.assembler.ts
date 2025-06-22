import { Account } from '../model/account.entity';
import { AccountResource, TopHeadlines } from './top-headlines.response';

export class AccountAssembler {
  static toEntityFromResource(resource: AccountResource): Account {
    return new Account(resource);
  }

  static toEntitiesFromResponse(response: TopHeadlines): Account[] {
    return response.map((account) => this.toEntityFromResource(account));
  }
} 