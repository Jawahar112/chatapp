import jwt from 'jsonwebtoken' 
import dotenv from 'dotenv'
dotenv.config()
const JWT_SECRET = process.env.SECRET_KEY;

// JWT Middleware function
export const jwtMiddleware = (socket, next) => {
  // Extract token from handshake query or custom header
  const token = socket.handshake.headers.token;

  if (!token) {
  
  console.log({Error:"No token Provided"})
 
   
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {

   console.log({Error:"Invalid token"});

    }

    socket.decoded = decoded;
    next();
  });
};

export const jwtexpressmiddleware = (req, res, next) => {
  // Extract token from handshake query or custom header
  const token = req.headers.authorization;

  if (!token) {
  return res.status(400).json({message:"NO token provided",status:false})
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.json({Error:err,Message:"Invalid token or malformed",status:false})
    }

    req.userId = decoded.userId;
    next();
  });
};

