import {
  protectAdmin,
  protectSession,
  protectUsersAccount,
} from "./../middlewares/auth.middlwares";
import { createUserValidators } from "./../middlewares/validators.middlewares";
import express from "express";

//controllers
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  login,
} from "../controller/users.controller";
import { userExists } from "../middlewares/users.middlewares";

const usersRouter = express.Router();

usersRouter.post("/signup", createUserValidators, createUser);

usersRouter.post("/login", login);

// Protecting below endpoints
usersRouter.use(protectSession);

usersRouter.get("/", getAllUsers);

usersRouter.patch("/:id", userExists, protectUsersAccount, updateUser);

usersRouter.delete("/:id", userExists, protectUsersAccount, deleteUser);

usersRouter.use(protectAdmin);

usersRouter.get("/:id", userExists, getUserById);

export { usersRouter };
