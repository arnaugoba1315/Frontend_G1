export interface User {
  id: number;
  username: string;
  bio: string;
  profilePicture: string;
  level: number;
  email: string;
  visible?: boolean;
}

export class User implements User {
  constructor(
    public id: number,
    public username: string,
    public bio: string,
    public profilePicture: string,
    public level: number,
    public email: string,
    public visible?: boolean
  ) {}
}