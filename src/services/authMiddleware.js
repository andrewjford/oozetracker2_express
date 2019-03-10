import jwt from 'jsonwebtoken';

const authMiddleware = {
  validateToken(req, res, next) {
    let token = req.headers['authorization'];
    if (token && token.startsWith('Bearer ')) {
      token = token.slice(7);
    }

    if (token) {
      jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
        if (err) {
          return res.json({
            success: false,
            message: 'Token is not valid'
          });
        } else {
          req.accountId = decoded.id;
          next();
        }
      });
    } else {
      return res.json({
        success: false,
        message: 'Auth token not provided'
      });
    }
  }
}
export default authMiddleware;