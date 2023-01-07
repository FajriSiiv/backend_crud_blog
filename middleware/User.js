export const cekLogin = async (req, res, next) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    return res.status(401).json({ msg: "Login terlebih dahulu" });
  } else {
    next();
  }
};
