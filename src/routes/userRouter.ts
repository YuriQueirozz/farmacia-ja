import { Router } from "express";
import { getUsers } from "../controller/userController";

const userRouter = Router();

userRouter.get("/usuarios", getUsers);

export default userRouter;