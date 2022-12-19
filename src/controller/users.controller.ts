import { prisma } from "./../utils/db.utils";
import { RequestHandler } from "express";
import { AppError } from "../utils/appError";
import jwt, { Secret } from "jsonwebtoken";
import bcrypt from "bcrypt";
import * as dotenv from "dotenv";

dotenv.config();

export const getAllUsers: RequestHandler = async (req, res, next) => {
  try {
    const users = await prisma.user.findMany({
      where: { status: "active" },
    });

    for (let user of users) {
      //@ts-expect-error
      delete user.password;
    }

    res.status(200).json({
      status: "success",
      data: {
        users,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getUserById: RequestHandler = (req, res) => {
  const { user } = req;

  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });
};

export const createUser: RequestHandler = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    let { role } = req.body;

    role = role || "normal";
    if (role !== "admin" && role !== "normal") {
      throw new AppError("Invalid role", 400);
    }

    // Encrypt the password
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await prisma.user.create({
      data: { name, email, password: hashedPassword, role },
    });

    //@ts-expect-error
    delete newUser.password;
    // 201 -> Success and a resource has been created
    res.status(201).json({
      status: "success",
      data: { newUser },
    });
  } catch (error) {
    next(error);
  }
};

export const updateUser: RequestHandler = async (req, res, next) => {
  try {
    const { name } = req.body;
    const { user } = req;

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: { name },
    });

    //@ts-expect-error
    delete updatedUser.password;

    res.status(200).json({
      status: "success",
      data: { user: updatedUser },
    });
  } catch (error) {
    next(error);
  }
};

export const deleteUser: RequestHandler = async (req, res, next) => {
  try {
    const { user } = req;

    await prisma.user.update({
      where: { id: user.id },
      data: { status: "disabled" },
    });

    res.status(204).json({ status: "success" });
  } catch (error) {
    next(error);
  }
};

export const login: RequestHandler = async (req, res, next) => {
  try {
    // Get email and password from req.body
    const { email, password } = req.body;

    // Validate if the user exist with given email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new AppError("User Not Found", 404);
    }

    if (user.status === "disabled") {
      throw new AppError("User is Banned", 403);
    }
    // Compare passwords (entered password vs db password)
    // If user doesn't exists or passwords doesn't match, send error
    if (!(await bcrypt.compare(password, user.password))) {
      throw new AppError("Wrong credentials", 400);
    }

    // Generate JWT (payload, secretOrPrivateKey, options)
    const SECRET_KEY: Secret = process.env.JWT_SECRET || "secret";
    const token = jwt.sign({ id: user.id }, SECRET_KEY, {
      expiresIn: "30d",
    });

    // Remove password from response
    //@ts-expect-error
    delete user.password;

    res.status(200).json({
      status: "success",
      data: { user, token },
    });
  } catch (error) {
    next(error);
  }
};
