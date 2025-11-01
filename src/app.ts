import express from "express";
import cors from "cors";
import usuariosRoutes from "./routes/usuariosRoutes";

export const app = express();

app.use(express.json());
app.use(cors());

app.use("/usuarios", usuariosRoutes);
