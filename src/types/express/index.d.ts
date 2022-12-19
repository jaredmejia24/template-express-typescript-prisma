declare namespace Express {
  export interface Request {
    user: import('@prisma/client').User;
    sessionUser: import('@prisma/client').User;
    artist: import('@prisma/client').Artist
  }
}
