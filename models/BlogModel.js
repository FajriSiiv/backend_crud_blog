import db from "../config/Database.js";
import { Sequelize } from "sequelize";

const { DataTypes } = Sequelize;

const BlogModel = db.define(
  "blog",
  {
    title: DataTypes.STRING,
    body: DataTypes.STRING,
    image: DataTypes.STRING,
    url: DataTypes.STRING,
    author: DataTypes.STRING,
    category: DataTypes.STRING,
  },
  {
    freezeTableName: true,
  }
);

(async () => {
  await db.sync();
})();

export default BlogModel;
