import express from "express";
import Event from "../models/Event.js";
import User from "../models/User.js";
import passport from "passport";

const router = express.Router();

/**
 * @swagger
 * /events:
 *   post:
 *     summary: Создать мероприятие (требуется авторизация)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: Концерт
 *               description:
 *                 type: string
 *                 example: Рок-концерт в клубе
 *               date:
 *                 type: string
 *                 format: date
 *                 example: 2025-09-01
 *     responses:
 *       201:
 *         description: Мероприятие успешно создано
 */
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const { title, description, date } = req.body;

      if (!title || !date) {
        return res.status(400).json({ error: "Название и дата обязательны" });
      }

      const event = await Event.create({
        title,
        description,
        date,
        createdBy: req.user.id, // берём из токена текущего пользователя
      });

      res.status(201).json({ message: "Мероприятие создано", event });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Ошибка при создании мероприятия" });
    }
  }
);

export default router;
