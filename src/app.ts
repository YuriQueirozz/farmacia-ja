import express from "express";
import cors from "cors";
import usuariosRoutes from "./routes/usuariosRoutes";
import medicamentosRoutes from "./routes/medicamentosRoutes";
import farmaciasRoutes from "./routes/farmaciasRoutes";

export const app = express();

app.use(express.json());
app.use(cors());

app.use("/usuarios", usuariosRoutes);
app.use("/medicamentos", medicamentosRoutes);
<<<<<<< HEAD
app.use("/farmacias", farmaciasRoutes);
=======

export default app;
>>>>>>> 42d8a717c20b05aef9d4e4c400ea1120ebd324c7
