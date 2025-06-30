import jwt from "jsonwebtoken";

export const generateToken = (userId, res) => {
  // Generate a JWT token with the user ID and a secret key
  //jwt.sign() is used to create a new JWT token that takes a payload (in this case, the userId), a secret key (process.env.JWT_SECRET), and options (like expiration time).
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
  res.cookie("jwt", token, {
    maxAge: 7 * 24 * 60 * 60 * 1000, // (7 days in milliseconds ) , means cookie will expire in 7 days
    httpOnly: true, // Prevents client-side JavaScript from accessing the cookie
    sameSite: "strict", // Helps prevent CSRF attacks
    // SameSite can be 'strict', 'lax', or 'none' (if secure is true)
    secure: process.env.NODE_ENV === "production", // Use secure cookies in production
  });
  return token;
};
