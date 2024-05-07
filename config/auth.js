import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config({
  path: '../config/.env'
});

 const isAuthenticated = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    console.log(token)
    if(!token){
      return res.status(401).json({
        msg: "User not authenticated",
        success: false,
      });
    }
    const decoded = await jwt.verify(token, process.env.JWT_SECRET);
    console.log(decoded)
    req.user = decoded.userId;
    next()
  } catch (err) {
    console.log(err)
  }
}

export default isAuthenticated;