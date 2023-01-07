import db from "../config/Database.js";
import { Sequelize } from "sequelize";

const { DataTypes } = Sequelize;

const User = db.define(
  "user",
  {
    username: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    role: DataTypes.STRING,
    token: DataTypes.STRING,
  },
  {
    freezeTableName: true,
  }
);

(async () => {
  await db.sync();
})();

export default User;
