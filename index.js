import express from "express";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import morgan from "morgan";
import dotenv from "dotenv";
import cors from "cors";
import rateLimit from "express-rate-limit";
import passport from "passport";

import sequelize, { testConnection } from "./config/db.js";
import configurePassport from "./config/passport.js";

dotenv.config();

import User from "./models/User.js";
import Event from "./models/Event.js";

sequelize.sync({ alter: true })
  .then(() => {
    console.log("Модели синхронизированы с базой данных");
  })
  .catch(err => {
    console.error("Ошибка при синхронизации моделей:", err);
  });

const app = express();

app.use(morgan(":method :url :status :response-time ms"));

app.use(express.json());

app.use(cors());

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, 
  max: 100,                
  message: { error: "Слишком много запросов, попробуйте позже." },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

app.use(passport.initialize());
configurePassport(passport);

import authRoutes from "./routes/auth.js";
import publicRoutes from "./routes/public.js";
import userRoutes from "./routes/users.js";

app.use("/auth", authRoutes);     
app.use("/public", publicRoutes); 
app.use("/users", userRoutes);    

app.get("/", (req, res) => {
  res.json({ message: "Сервер работает!" });
});

testConnection();

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Event API",
      version: "1.0.0",
      description: "Документация для API пользователей и мероприятий",
    },
  },
  apis: ["./routes/*.js"],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Сервер запущен: http://localhost:${PORT}`);
  console.log(`Swagger: http://localhost:${PORT}/api-docs`);
});
