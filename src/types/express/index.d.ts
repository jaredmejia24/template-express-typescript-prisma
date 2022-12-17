interface Model {
  id: number;
  createdAt: Date;
  updatedAt: Date;
}

 interface User extends Model {
  name: string;
  email: string;
  role: string;
  status: string;
  password?: string;
}

declare namespace Express {
  export interface Request {
    user?: User;
    sessionUser?: User;
  }
}
