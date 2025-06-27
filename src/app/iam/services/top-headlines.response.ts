export type TopHeadlines = AccountResource[];

export interface AccountResource {
  id: number;
  name: string;
  email: string;
  passwordHashed: string;
  role: string;
  createdAt: string;
} 

export interface AccountCredentials {
  name: string;
  email: string;
  password: string;
  role: string;
} 