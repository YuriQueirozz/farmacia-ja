import express from "express";
import cors from "cors";
import usuariosRoutes from "./routes/usuariosRoutes";
import medicamentosRoutes from "./routes/medicamentosRoutes";
import farmaciasRoutes from "./routes/farmaciasRoutes";

export const app = express();

const corsOptions = {
    origin: [
        "http://localhost:3000",
        "http://localhost:5173",
        "https://seu-futuro-site.com",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

app.use("/usuarios", usuariosRoutes);
app.use("/medicamentos", medicamentosRoutes);
app.use("/farmacias", farmaciasRoutes);

export default app;