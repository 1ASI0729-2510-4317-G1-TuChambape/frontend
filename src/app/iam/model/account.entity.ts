export class Account {
  id: number;
  name: string;
  email: string;
  role: string;

  constructor(params: {
    id: number;
    name: string;
    email: string;
    role: string;
  }) {
    this.id = params.id;
    this.name = params.name;
    this.email = params.email;
    this.role = params.role;
  }
}
