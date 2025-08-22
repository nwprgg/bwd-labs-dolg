import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { User } from '@models/index';

interface JwtPayload {
  id: number;
  [key: string]: any;
}

const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret) {
  throw new Error('JWT_SECRET is not defined in environment variables');
}

const strategyOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: jwtSecret,
};

const verifyCallback = async (
  jwt_payload: JwtPayload,
  done: (error: Error | null, user?: User | false, info?: object) => void,
) => {
  try {
    const user = await User.findByPk(jwt_payload.id);

    if (user) {
      return done(null, user);
    }
    return done(null, false, { message: 'User not found' });
  } catch (error) {
    if (error instanceof Error) {
      return done(error, false);
    }
    return done(new Error('Authentication error'), false);
  }
};

passport.use(new JwtStrategy(strategyOptions, verifyCallback));

export const authenticateJwt = passport.authenticate('jwt', { session: false });

export default passport;
