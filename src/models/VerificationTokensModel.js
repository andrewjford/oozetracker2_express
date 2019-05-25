import db from '../services/dbService';
import bcrypt from 'bcryptjs';
import mailer from '../services/mailer';

const VerificationTokensModel = {
  async create(req) {
    const sqlString = `
      INSERT INTO
        verification_tokens(token, account_id)
      VALUES($1, $2)
      RETURNING token, account_id`;
    
    const token = await bcrypt.hash(req.email, 10);
    const values = [
      token,
      req.account_id,
    ];
    console.log(values);

    const { rows } = await db.query(sqlString, values);

    mailer.sendVerificationMessage(req.email, rows[0].token);
  }
}

export default VerificationTokensModel;