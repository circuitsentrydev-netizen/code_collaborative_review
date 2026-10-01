import express from "express";
import dotenv from "dotenv";
import {textDbConnection} from '../src/config/database'
import userRouter from "./routes/userRoutes";
dotenv.config();

const app = express()
const PORT = process.env.PORT || 3000;

const startServer = async () => {
    await textDbConnection();
    app.use(express.json());
      app.use("/api", userRouter);


    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`)
    })
}
startServer()