import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  NonAttribute,
} from 'sequelize';
import { sequelize } from '@config/db';
import bcrypt from 'bcrypt';

interface UserInstanceMethods {
  validPassword(password: string): Promise<boolean>;
}

class User
  extends Model<InferAttributes<User>, InferCreationAttributes<User>>
  implements UserInstanceMethods
{
  declare id: CreationOptional<number>;
  declare name: string;
  declare email: string;
  declare password: string;
  declare failed_attempts: number;
  declare is_locked: boolean;
  declare lock_until: Date | null;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  declare validPassword: (password: string) => Promise<boolean>;
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    failed_attempts: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    is_locked: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    lock_until: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'User',
    tableName: 'users',
    timestamps: true,
    hooks: {
      beforeCreate: async (user: User) => {
        console.log('User data before creation:', user.get());

        if (!user.password || typeof user.password !== 'string') {
          throw new Error('Password is required and must be a string');
        }

        try {
          user.password = await bcrypt.hash(user.password, 10);
        } catch (error) {
          console.error('Error hashing password:', error);
          throw new Error('Failed to hash password');
        }
      },
    },
  },
);

User.prototype.validPassword = async function (
  password: string,
): Promise<boolean> {
  return bcrypt.compare(password, this.password);
};

export default User;