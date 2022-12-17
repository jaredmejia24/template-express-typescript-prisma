import express, { Express } from "express";
import { globalErrorHandler } from "./controller/error.controller";
import { usersRouter } from "./routes/users.routes";

const app: Express = express();

app.use(express.json());

app.use("/api/v1/users", usersRouter);

//catch errors
app.use(globalErrorHandler);

// Catch non-existing endpoints
app.all("*", (req, res) => {
  res.status(404).json({
    status: "error",
    message: `${req.method} ${req.url} does not exists in our server`,
  });
});

const PORT: number = 4000;

app.listen(PORT, () => {
  console.log(`Express app running! in port ${PORT}`);
});
