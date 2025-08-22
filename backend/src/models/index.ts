import { sequelize } from '@config/db';
import User from './user.model';
import Event from './event.model';

User.hasMany(Event, { foreignKey: 'createdBy', as: 'events' });

export { sequelize, User, Event };
