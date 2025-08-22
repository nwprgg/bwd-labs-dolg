import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { Event, User } from '@models/index';

interface PaginationQuery {
  page?: string;
  limit?: string;
}

interface EventParams {
  id: string;
}

interface CreateEventBody {
  title: string;
  description?: string;
  date: string;
}

interface UpdateEventBody {
  title: string;
  description?: string;
  date: string;
}

interface JwtPayload {
  id: number;
  [key: string]: any;
}

const parseAndValidateDate = (dateString: string): Date => {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    throw new Error('Неверный формат даты');
  }
  return date;
};

const getAllEvents = async (
  req: Request<{}, {}, {}, PaginationQuery>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const page = parseInt(req.query.page || '1');
    const limit = parseInt(req.query.limit || '10');

    if (isNaN(page) || page < 1 || isNaN(limit) || limit < 1) {
      return res
        .status(400)
        .json({ message: 'Некорректные значения пагинации' });
    }

    const offset = (page - 1) * limit;

    const { count, rows: events } = await Event.findAndCountAll({
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email'],
        },
      ],
      order: [['date', 'ASC']],
      limit,
      offset,
    });

    res.status(200).json({
      totalEvents: count,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      events,
    });
  } catch (error) {
    next(error);
  }
};

const getEventById = async (
  req: Request<EventParams>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const event = await Event.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email'],
        },
      ],
    });

    if (!event) {
      return res.status(404).json({ message: 'Мероприятие не найдено' });
    }

    res.status(200).json(event);
  } catch (error) {
    next(error);
  }
};

const createEvent = async (
  req: Request<{}, {}, CreateEventBody>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { title, description, date } = req.body;

    if (!title || !date) {
      return res.status(400).json({ message: 'Название и дата обязательны' });
    }

    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Требуется авторизация' });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string,
    ) as JwtPayload;

    if (!decoded?.id) {
      return res.status(401).json({ message: 'Неверный токен' });
    }

    const eventDate = parseAndValidateDate(date);

    const event = await Event.create({
      title,
      description,
      date: eventDate,
      createdBy: decoded.id,
    });

    const eventWithUser = await Event.findByPk(event.id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email'],
        },
      ],
    });

    res.status(201).json(eventWithUser);
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ message: 'Неверный токен' });
    }
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ message: 'Токен истек' });
    }
    if (error instanceof Error && error.message === 'Неверный формат даты') {
      return res.status(400).json({ message: error.message });
    }
    next(error);
  }
};

const updateEvent = async (
  req: Request<EventParams, {}, UpdateEventBody>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { title, description, date } = req.body;
    const { id } = req.params;

    if (!title || !date) {
      return res.status(400).json({ message: 'Название и дата обязательны' });
    }

    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Требуется авторизация' });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string,
    ) as JwtPayload;

    if (!decoded?.id) {
      return res.status(401).json({ message: 'Неверный токен' });
    }

    const event = await Event.findByPk(id);
    if (!event) {
      return res.status(404).json({ message: 'Мероприятие не найдено' });
    }

    if (event.createdBy !== decoded.id) {
      return res
        .status(403)
        .json({ message: 'Нет доступа для редактирования' });
    }

    const eventDate = parseAndValidateDate(date);

    await event.update({
      title,
      description,
      date: eventDate,
    });

    const updatedEvent = await Event.findByPk(id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email'],
        },
      ],
    });

    res.status(200).json(updatedEvent);
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ message: 'Неверный токен' });
    }
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ message: 'Токен истек' });
    }
    if (error instanceof Error && error.message === 'Неверный формат даты') {
      return res.status(400).json({ message: error.message });
    }
    next(error);
  }
};

const deleteEvent = async (
  req: Request<EventParams>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Требуется авторизация' });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string,
    ) as JwtPayload;

    if (!decoded?.id) {
      return res.status(401).json({ message: 'Неверный токен' });
    }

    const event = await Event.findByPk(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Мероприятие не найдено' });
    }

    if (event.createdBy !== decoded.id) {
      return res.status(403).json({ message: 'Нет доступа для удаления' });
    }

    await event.destroy();
    res.status(204).end();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ message: 'Неверный токен' });
    }
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ message: 'Токен истек' });
    }
    next(error);
  }
};

export { getAllEvents, getEventById, createEvent, updateEvent, deleteEvent };