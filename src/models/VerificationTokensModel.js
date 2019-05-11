import db from '../services/dbService';
import bcrypt from 'bcryptjs';

const VerificationTokensModel = {
  async create(req) {
    const sqlString = `
      INSERT INTO
        verification_tokens(token, account_id)
      VALUES($1, $2)
      RETURNING token, account_id`;
    
    const values = [
      bcrypt.hash(req.email, 10),
      req.account_id,
    ];

    const { rows } = await db.query(sqlString, values);

    // send verification email
  }
}