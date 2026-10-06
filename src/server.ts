import express from "express";
import dotenv from "dotenv";
import {textDbConnection} from '../src/config/database'
import userRouter from "./routes/userRoutes"
import projectRouter from "./routes/projectRoutes"
import submissionRoutes from "./routes/submissionRoutes"
import commentsRoutes from "./routes/commentsRoutes"
import reviewRoutes from "./routes/reviewRoutes"
dotenv.config();

const app = express()
const PORT = process.env.PORT || 3000;

const startServer = async () => {
    await textDbConnection();
    app.use(express.json());

      app.use("/api", userRouter);
      app.use("/api" , projectRouter);
      app.use("/api", submissionRoutes);
      app.use("/api", commentsRoutes)
      app.use("/api", reviewRoutes)

    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`)
    })
}
startServer()