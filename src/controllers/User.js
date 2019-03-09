import db from '../db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const User = {
  async create(req, res) {
    const sqlString = `
      INSERT INTO
        users(name, email, password)
      VALUES($1, $2, $3)
      RETURNING id, name, email`;
    const values = [
      req.body.name,
      req.body.email,
      bcrypt.hashSync(req.body.password, 10),
    ];

    try {
      const { rows } = await db.query(sqlString, values);
      const tokenExpiration = 24*60*60;
      const token = jwt.sign({id: rows[0].id}, process.env.SECRET_KEY, {expiresIn: tokenExpiration});
      return res.status(201).send({
        user: rows[0], token, tokenExpiration});
    } catch(error) {
      console.log(error);
      return res.status(400).send(error);
    }
  },

  async login(req, res) {
    const sqlString = `SELECT id, password 
      FROM users 
      WHERE email = $1`;
    try {
      const { rows } = await db.query(sqlString, [req.body.email]);
      const user = rows[0];
      if (!user) {
        return res.status(404).send({'message': 'Account not found for provided email'});
      }
      
      const passwordIsCorrect = bcrypt.compareSync(req.body.password, user.password);
      if (!passwordIsCorrect) {
        return res.status(401).send('Password not valid!');
      }

      const tokenExpiration = 24*60*60;
      const token = jwt.sign({id: user.id}, process.env.SECRET_KEY, {expiresIn: tokenExpiration});
      return res.status(201).send({
        user: {id: user.id},
        token,
        tokenExpiration
      });
    } catch(error) {
      return res.status(400).send(error)
    }
  }
}

export default User;