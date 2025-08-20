import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import passport from "passport";
import dotenv from "dotenv";
import User from "../models/User.js";

dotenv.config();
const router = express.Router();

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Получить список пользователей (требует JWT)
 *     responses:
 *       200:
 *         description: Успешный ответ со списком пользователей
 */
router.get("/", passport.authenticate("jwt", { session: false }), async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ["id", "name", "email", "createdAt"]
    });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Ошибка сервера" });
  }
});

router.get("/:id", passport.authenticate("jwt", { session: false }), async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: ["id", "name", "email", "createdAt"]
    });

    if (!user) {
      return res.status(404).json({ error: "Пользователь не найден" });
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Ошибка сервера" });
  }
});

router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    if (!name || !email || !password) {
      return res.status(400).json({ error: "Имя, email и пароль обязательны" });
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: "Пользователь уже существует" });
    }

    const newUser = await User.create({ name, email, password });

    res.json({
      message: "Пользователь зарегистрирован",
      user: { id: newUser.id, name: newUser.name, email: newUser.email },
    });
  } catch (err) {
    console.error("Ошибка при регистрации:", err);
    res.status(500).json({ error: "Ошибка сервера" });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(400).json({ message: "Неверный email или пароль" });

    if (user.isLocked) {
      if (user.lockUntil && user.lockUntil > new Date()) {
        return res.status(403).json({ message: "Аккаунт временно заблокирован. Попробуйте позже." });
      } else {
        user.isLocked = false;
        user.failedAttempts = 0;
        user.lockUntil = null;
        await user.save();
      }
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      user.failedAttempts += 1;

      if (user.failedAttempts >= 5) {
        user.isLocked = true;
        user.lockUntil = new Date(Date.now() + 15 * 60 * 1000); // блокировка на 15 минут
      }

      await user.save();
      return res.status(400).json({ message: "Неверный email или пароль" });
    }

    user.failedAttempts = 0;
    user.isLocked = false;
    user.lockUntil = null;
    await user.save();

    const payload = { id: user.id, name: user.name };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.json({ success: true, token: "Bearer " + token });
  } catch (err) {
    console.error("Ошибка при логине:", err);
    res.status(500).json({ error: "Ошибка сервера" });
  }
});

router.get("/profile/me", passport.authenticate("jwt", { session: false }), (req, res) => {
  res.json({ message: "Добро пожаловать в профиль!", user: req.user });
});

export default router;
