import AccountModel from '../models/AccountModel';
import db from '../services/dbService';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const AccountController = {
  async create(req, res) {
    if (!req.body.name, !req.body.email, !req.body.password) {
      return res.status(400).send({message: 'Missing required params'});
    }

    try {
      const modelResponse = await AccountModel.create(req);
      return res.status(201).send(modelResponse);
    } catch(error) {
      console.log(error);
      return res.status(400).send("error creating user");
    }
  },

  async login(req, res) {
    const sqlString = `SELECT id, password 
      FROM accounts 
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
      return res.status(200).send({
        user: {id: user.id},
        token,
        tokenExpiration
      });
    } catch(error) {
      return res.status(400).send(error)
    }
  },

  async delete(req, res) {
    try {
      const result = await AccountModel.delete(req);
      if(result.rowCount === 0) {
        return res.status(404).send({'message': 'category not found'});
      }
      return res.status(204).send({ 'message': 'deleted' });
    } catch(error) {
      return res.status(400).send(error);
    }
  }
}

export default AccountController;