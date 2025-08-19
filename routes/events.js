import express from "express";
import Event from "../models/Event.js";
import User from "../models/User.js";

const router = express.Router();

/**
 * @swagger
 * /events:
 *   get:
 *     summary: Получить список мероприятий (с пагинацией)
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           example: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           example: 10
 *     responses:
 *       200:
 *         description: Список мероприятий с постраничной загрузкой
 *
 *   post:
 *     summary: Создать мероприятие
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
 *               createdBy:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       201:
 *         description: Мероприятие успешно создано
 */

router.get("/", async (req, res) => {
  try {

    const page = parseInt(req.query.page) || 1;   
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const { rows: events, count } = await Event.findAndCountAll({
      limit,
      offset,
      include: [
        {
          model: User,
          attributes: ["id", "name", "email"],
        },
      ],
      order: [["date", "ASC"]], 
    });

    res.json({
      total: count,             
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      events,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Ошибка при получении мероприятий" });
  }
});

export default router;
