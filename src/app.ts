import express from "express";
import cors from "cors";
import usuariosRoutes from "./routes/usuariosRoutes";
import medicamentosRoutes from "./routes/medicamentosRoutes";

export const app = express();

app.use(express.json());
app.use(cors());

app.use("/usuarios", usuariosRoutes);
app.use("/medicamentos", medicamentosRoutes);

export default app;
