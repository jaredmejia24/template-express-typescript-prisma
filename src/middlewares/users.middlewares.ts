import { AppError } from "./../utils/appError";
import { prisma } from "./../utils/db.utils";
import { RequestHandler } from "express";

export const userExists: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user: User | null = await prisma.user.findFirst({
      where: { id: Number(id), status: "active" },
    });

    if (!user) {
      throw new AppError("User Not Found", 404);
    }

    delete user.password;

    req.user = user;

    next();
  } catch (error) {
    next(error);
  }
};
