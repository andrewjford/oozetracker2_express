import jwt from "jsonwebtoken";

const authMiddleware = {
  validateToken(req, res, next) {
    let token = req.headers["authorization"];
    if (token && token.startsWith("Bearer ")) {
      token = token.slice(7);
    }

    if (token) {
      jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
        if (err) {
          return res.status(401).json({
            success: false,
            message: "Token is not valid"
          });
        } else {
          req.accountId = decoded.id;
          next();
        }
      });
    } else {
      return res.status(401).send({
        success: false,
        message: "No valid token provided"
      });
    }
  }
};
export default authMiddleware;
