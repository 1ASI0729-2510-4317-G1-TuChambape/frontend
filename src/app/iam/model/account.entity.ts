export class Account {
  id: number;
  name: string;
  email: string;
  passwordHashed: string;
  role: string;
  createdAt: string;

  constructor(params: {
    id: number;
    name: string;
    email: string;
    passwordHashed: string;
    role: string;
    createdAt: string;
  }) {
    this.id = params.id;
    this.name = params.name;
    this.email = params.email;
    this.passwordHashed = params.passwordHashed;
    this.role = params.role;
    this.createdAt = params.createdAt;
  }
}
