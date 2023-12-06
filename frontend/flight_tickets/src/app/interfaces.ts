export interface User {
  password: string,
  username: string,
  role: string
};

export enum ROLES {
  ADMIN = "boss",
  EMPLOYEE = "employee",
}