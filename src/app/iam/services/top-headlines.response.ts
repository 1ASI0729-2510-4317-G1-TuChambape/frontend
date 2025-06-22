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
  email: string;
  password: string;
}