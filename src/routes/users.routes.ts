import express from "express";

//middlewares
import {
  protectAdmin,
  protectSession,
  protectUsersAccount,
} from "./../middlewares/auth.middlwares";

//validators
import {
  createUserValidators,
  updateUserValidators,
} from "./../middlewares/validators.middlewares";

//controllers
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  login,
} from "../controller/users.controller";

//user middlewares
import { userExists } from "../middlewares/users.middlewares";

const usersRouter = express.Router();

usersRouter.post("/signup", createUserValidators, createUser);

usersRouter.post("/login", login);

// Protecting below endpoints
usersRouter.use(protectSession);

usersRouter.patch(
  "/:id",
  userExists,
  protectUsersAccount,
  updateUserValidators,
  updateUser
);

usersRouter.delete("/:id", userExists, protectUsersAccount, deleteUser);

usersRouter.use(protectAdmin);

usersRouter.get("/", getAllUsers);

usersRouter.get("/:id", userExists, getUserById);

export { usersRouter };
