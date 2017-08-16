export class User {
  public _id?: string;
  public username: string;
  public password?: string;
  public confirmPassword?: string;
  public token: string;
  public roles: string[];
}
