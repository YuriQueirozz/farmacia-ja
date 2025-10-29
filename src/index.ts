import { app } from "./app";
import userRouter from "./routes/userRouter";
import medicamentosRouter from "./routes/medicamentosRoutes";
import dotenv from 'dotenv';
import express from 'express';

app.use('/users', userRouter)
app.use('/medicamentos', medicamentosRouter);