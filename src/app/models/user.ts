export interface User {
  id?: string;
  uid: string;
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'employee';
  createdAt: any;
}
