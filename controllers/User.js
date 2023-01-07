import User from "../models/UserModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import validator from "email-validator";

export const getUser = async (req, res) => {
  try {
    const response = await User.findAll();

    res.status(200).json(response);
  } catch (error) {
    console.log(error.message);
  }
};

export const getUserById = async (req, res) => {
  const user = await User.findOne({
    where: {
      id: req.params.id,
    },
  });

  try {
    res.status(200).json(user);
  } catch (error) {
    console.log(error.message);
  }
};
export const createUser = async (req, res) => {
  const { username, email, password, confirm_password } = req.body;

  if (password !== confirm_password)
    return res
      .status(400)
      .json({ msg: "Password dan Confirm Password tidak cocok" });

  if (!validator.validate(email))
    return res
      .status(422)
      .json({ msg: "Email harus (contoh : nama@gmail.com)" });

  const salt = await bcrypt.genSalt();
  const hashPassword = await bcrypt.hash(password, salt);

  try {
    await User.create({
      email: email,
      username: username,
      password: hashPassword,
      role: "admin",
    });
    res.status(200).send({ success: "User telah dibuat" });
  } catch (error) {
    console.log(error.message);
  }
};

export const updateUser = async (req, res) => {
  try {
    await User.update(req.body, {
      where: {
        id: req.params.id,
      },
    });
    res.status(200).json({ msg: "Update user berhasil" });
  } catch (error) {
    console.log(error.message);
  }
};

export const deleteUser = async (req, res) => {};

// LOGIN LOGOUT
export const login = async (req, res) => {
  try {
    const user = await User.findAll({
      where: {
        email: req.body.email,
      },
    });

    const match = await bcrypt.compare(req.body.password, user[0].password);
    if (!match) return res.status(400).json({ msg: "Password salah" });

    const userId = user[0].id;
    const username = user[0].username;
    const email = user[0].email;
    const role = user[0].role;

    const accessToken = jwt.sign(
      { userId, username, email, role },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "1d",
      }
    );
    const refreshToken = jwt.sign(
      { userId, username, email, role },
      process.env.REFRESH_TOKEN_SECRET,
      {
        expiresIn: "1d",
      }
    );
    await User.update(
      { token: refreshToken },
      {
        where: {
          id: userId,
        },
      }
    );
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.json({ accessToken });
  } catch (error) {
    res.status(404).json({ msg: "Gagal Login" });
  }
};

export const logout = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) return res.sendStatus(204);

  const user = await User.findAll({
    where: {
      token: refreshToken,
    },
  });
  if (!user[0]) return res.sendStatus(204);
  const userId = user[0].id;
  await User.update(
    { token: null },
    {
      where: {
        id: userId,
      },
    }
  );
  res.clearCookie("refreshToken");
  return res.status(200).send({ msg: "Logout Berhasil" });
};
