import express from "express";
import {
  createBlog,
  deleteBlog,
  getBlogById,
  getBlogs,
  updateBlog,
} from "../controllers/Blog.js";
import {
  createUser,
  deleteUser,
  getUser,
  getUserById,
  login,
  logout,
  updateUser,
} from "../controllers/User.js";
import { refreshToken } from "../controllers/RefreshToken.js";
import { cekLogin } from "../middleware/User.js";

const router = express.Router();

// user
router.get("/user", cekLogin, getUser);
router.get("/user/:id", cekLogin, getUserById);
router.post("/user", createUser);
router.patch("/user/:id", cekLogin, updateUser);
router.delete("/user/:id", deleteUser);

// login & logout
router.post("/login", login);
router.delete("/logout", cekLogin, logout);
router.get("/token", refreshToken);

// blog
router.get("/blog", getBlogs);
router.get("/blog/:id", getBlogById);
router.post("/blog", cekLogin, createBlog);
router.patch("/blog/:id", cekLogin, updateBlog);
router.delete("/blog/:id", cekLogin, deleteBlog);

export default router;
