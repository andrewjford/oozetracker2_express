import db from '../services/dbService';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

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

  async delete(req) {
    const deleteQuery = 'DELETE FROM accounts WHERE id = $1';
    return db.query(deleteQuery, [req.accountId]);
  }
}

export default AccountModel;