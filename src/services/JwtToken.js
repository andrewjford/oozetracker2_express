import { THIRTY_DAYS, ONE_DAY } from "../constants";
import jwt from "jsonwebtoken";

export default class JwtToken {
  requestToTokenExpiration(req) {
    let expiration;

    if (req.header("Client-Type") === "mobile") {
      expiration = THIRTY_DAYS;
    } else if (req.body.rememberMe === true) {
      expiration = THIRTY_DAYS;
    } else {
      expiration = ONE_DAY;
    }

    return expiration;
  }

  generate(userId, expiration) {
    return jwt.sign({ id: userId }, process.env.SECRET_KEY, {
      expiresIn: expiration
    });
  }
}
