import jwt from "jsonwebtoken";

const generateTokenAndSetCookie = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "15d",
  });

  res.cookie("jwt", token, {
    httpOnly: true, // more secure
    maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days
    // sameSite: "strict", // CSRF
    sameSite: "None", // For cross-origin requests
    secure: true, // Requires HTTPS
  });

  return token;
};

export default generateTokenAndSetCookie;
