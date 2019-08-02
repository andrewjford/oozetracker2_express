import db from '../services/dbService';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const AccountModel = {
  async getOne(req) {
    const text = 'SELECT * FROM accounts WHERE id = $1';
    return db.query(text, [req.params.id]);
  },

  async getByEmail(email) {
    const queryText = 'SELECT * FROM accounts WHERE email = $1';
    return db.query(queryText, [email]);
  },

  async login(req) {
    const { rows } = await this.getByEmail(req.body.email.toLowerCase());
    const user = rows[0];
    if (!user) {
      return {
        status: "Not Found", message: "Account not found for provided email"};
    }

    if (!await validPassword(user, req.body.password)) {
      return {status: "Unauthorized", message: "Password not valid"};
    }

    const tokenExpiration = req.header("Client-Type") === "mobile" ? 24*60*60*30 : 24*60*60;
    const token = jwt.sign({id: user.id}, process.env.SECRET_KEY, {expiresIn: tokenExpiration});
    return {
      status: "Success",
      user: {id: user.id},
      token,
      tokenExpiration
    };
  },

  async validPassword(user, password) {
    return bcrypt.compareSync(password, user.password);
  },

  async validateAccount(req) {
    const query = `SELECT v.*, a.*
      FROM verification_tokens v 
      LEFT JOIN accounts a ON v.account_id = a.id
      WHERE v.token = $1`;
    const { rows } = await db.query(query, [req.query.token]);
    if (rows && rows.length > 0) {
      // update account
      // delete verification token
      console.log(rows[0]);
    }
  }
}

export default AccountModel;