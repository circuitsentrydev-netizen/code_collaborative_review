import express from "express";
import dotenv from "dotenv";
import {textDbConnection} from '../src/config/database'
import userRouter from "./routes/userRoutes";
import projectRouter from "./routes/authRoutes"
dotenv.config();

const app = express()
const PORT = process.env.PORT || 3000;

const startServer = async () => {
    await textDbConnection();
    app.use(express.json());
      app.use("/api", userRouter);
      app.use("/api" , projectRouter)


    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`)
    })
}
startServer()