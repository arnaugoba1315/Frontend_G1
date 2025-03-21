export interface User {
  _id: string; // Cambiado de number a string para alinearse con MongoDB ObjectId
  username: string;
  bio: string;
  profilePicture: string;
  level: number;
  email: string;
  visible?: boolean;
}

export class User implements User {
  constructor(
    public _id: string, // Cambiado de number a string
    public username: string,
    public bio: string,
    public profilePicture: string,
    public level: number,
    public email: string,
    public visible?: boolean
  ) {}
}