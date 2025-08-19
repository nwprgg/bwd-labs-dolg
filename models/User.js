// models/User.js
import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const User = sequelize.define("User", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false, // обязательно
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true, // уникальный email
    validate: {
      isEmail: true, // проверка формата
    },
  },
}, {
  timestamps: true, // createdAt и updatedAt автоматически
});

export default User;
