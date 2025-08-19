import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME,     
  process.env.DB_USER,     
  process.env.DB_PASS,     
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: "postgres",
    logging: false, 
  }
);

export async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log("Подключение к базе успешно установлено!");
  } catch (error) {
    console.error("Ошибка подключения к базе:", error);
  }
}

export default sequelize;
