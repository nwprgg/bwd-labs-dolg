import { Request, Response, NextFunction } from 'express';
import { User } from '@models/index';

interface CreateUserBody {
  name: string;
  email: string;
  password: string;
}

const createUser = async (
  req: Request<{}, {}, CreateUserBody>,
  res: Response,
  next: NextFunction,
) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'email, имя и пароль обязательны' });
  }

  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'Такой email уже есть' });
    }

    const newUser = await User.create({
      name,
      email,
      password,
      failed_attempts: 0,
      is_locked: false,
      lock_until: null,
    });

    res.status(201).json({
      message: 'Пользователь успешно создан',
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getUserById = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction,
) => {
  const { id } = req.params;

  try {
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }

    res.status(200).json({
      id: user.id,
      name: user.name,
      email: user.email,
    });
  } catch (error) {
    next(error);
  }
};

export { createUser, getUserById };
