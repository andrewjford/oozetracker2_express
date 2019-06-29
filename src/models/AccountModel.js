import db from '../services/dbService';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import models from '../models/models';
import mailer from '../services/mailer';

const AccountModel = {
  async create(req) {
    const sqlString = `
      INSERT INTO
        accounts(name, email, password)
      VALUES($1, $2, $3)
      RETURNING id, name, email`;
    
    const values = [
      req.body.name,
      req.body.email,
      bcrypt.hashSync(req.body.password, 10),
    ];

    const { rows } = await db.query(sqlString, values);
    const verificationToken = await bcrypt.hash(rows[0].email, 10);
    const verificationTokenModel = await models.VerificationToken.create({
      token: verificationToken,
      account_id: rows[0].id,
    });

    mailer.sendVerificationMessage(rows[0].email, verificationTokenModel.token);

    const tokenExpiration = 24*60*60;
    const token = jwt.sign({id: rows[0].id}, process.env.SECRET_KEY, {expiresIn: tokenExpiration});

    return {
      user: rows[0],
      token,
      tokenExpiration
    };
  },

  async getOne(req) {
    const text = 'SELECT * FROM accounts WHERE id = $1';
    return db.query(text, [req.params.id]);
  },

  async getByEmail(email) {
    const queryText = 'SELECT * FROM accounts WHERE email = $1';
    return db.query(queryText, [email]);
  },

  async update(req) {
  },

  async delete(req) {
    const deleteQuery = 'DELETE FROM accounts WHERE id = $1';
    return db.query(deleteQuery, [req.accountId]);
  },

  async login(req) {
    const { rows } = await this.getByEmail(req.body.email);
    const user = rows[0];
    if (!user) {
      return {
        status: "Not Found", message: "Account not found for provided email"};
    }

    const passwordIsCorrect = bcrypt.compareSync(req.body.password, user.password);
    if (!passwordIsCorrect) {
      return {status: "Unauthorized", message: "Password not valid"};
    }

    const tokenExpiration = req.header("Client") === "mobile" ? 24*60*60*30 : 24*60*60;
    const token = jwt.sign({id: user.id}, process.env.SECRET_KEY, {expiresIn: tokenExpiration});
    return {
      status: "Success",
      user: {id: user.id},
      token,
      tokenExpiration
    };
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