import { app } from "./app";
import userRouter from "./routes/usuariosRoutes";

app.use('/users', userRouter)