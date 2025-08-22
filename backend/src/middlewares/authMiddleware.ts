import passport from '@config/passport';
import { Request, Response, NextFunction } from 'express';

interface AuthenticatedUser {
  id: number;
  role: string;
  [key: string]: any;
}

interface AuthenticatedRequest extends Request {
  user: AuthenticatedUser;
}

const authenticateJWT = passport.authenticate('jwt', { session: false });

const authorizeRole =
  (roles: string[]) =>
  (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res
        .status(401)
        .json({ message: 'Пользователь не аутентифицирован' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Доступ запрещен' });
    }

    next();
  };

export { authenticateJWT, authorizeRole };
