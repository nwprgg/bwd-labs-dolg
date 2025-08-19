import express from "express";
import User from "../models/User.js";

const router = express.Router();

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Получить список пользователей
 *     responses:
 *       200:
 *         description: Успешный ответ со списком пользователей
 *
 *   post:
 *     summary: Создать нового пользователя
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Иван
 *               email:
 *                 type: string
 *                 example: ivan@example.com
 *     responses:
 *       201:
 *         description: Пользователь успешно создан
 *       400:
 *         description: Ошибка валидации (например, email уже существует)
 */

router.get("/", async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    console.error("Ошибка при получении пользователей:", error);
    res.status(500).json({ error: "Ошибка при получении пользователей" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({ error: "Имя и email обязательны" });
    }

const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: "Пользователь с таким email уже существует" });
    }

    const newUser = await User.create({ name, email });
    res.status(201).json(newUser);

  } catch (error) {
    console.error("Ошибка при создании пользователя:", error);
    res.status(500).json({ error: "Ошибка при создании пользователя" });
  }
});

export default router;
