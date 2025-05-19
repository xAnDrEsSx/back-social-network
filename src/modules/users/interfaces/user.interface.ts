export interface IUser {
  id: string;
  firstName: string;
  lastName: string;
  birthDate: Date;
  username: string;
  email: string;
  passwordHash: string;
  createdAt: Date;
}