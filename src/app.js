import express from "express";
import morgan from "morgan";
import cors from "cors";
import helmet from "helmet";

import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import notFound from "./middlewares/notFound.js";

const app = express();

// Middlewares
app.use(morgan("dev"));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());

// Rutas
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use(notFound);

export default app;
