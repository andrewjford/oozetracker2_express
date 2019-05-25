import AccountModel from '../models/AccountModel';
import AccountValidator from '../validators/AccountValidator';
import db from '../services/dbService';
import models from '../models/models';

const AccountController = {
  async mail(req, res) {
    if (req.body.token) {
      return models.VerificationToken.create({
        token: '100',
        account_id: 1,
      });
    }
    return res.status(400).send('negs');
  },

  async validateAccount(req, res) {
    const query = `SELECT v.*, a.*
      FROM verification_tokens v 
      LEFT JOIN accounts a ON v.account_id = a.id
      WHERE v.token = $1`;
    const { rows } = await db.query(query, [req.query.token]);

    if (rows && rows.length > 0) {
      // update account
      // delete verification token
      console.log(rows[0]);
      res.status(200).send('validate endpoint hittered');
    } else {
      return res.status(400).send('Invalid token');
    }
  },

  async create(req, res) {
    const errors = AccountValidator.onCreate(req);
    if (errors.length > 0) {
      return res.status(422).send({ message: errors });
    }

    try {
      const modelResponse = await AccountModel.create(req);
      return res.status(201).send(modelResponse);
    } catch(error) {
      if (error.code === '23505') {
        return res.status(422).send({message: ["A user already exists for this email."]});
      }
      return res.status(400).send("error creating user");
    }
  },

  async login(req, res) {
    try {
      const result = await AccountModel.login(req);
      switch (result.status) {
        case "Success":
          return res.status(200).send(result);
        case "Not Found":
          return res.status(404).send(result);
        case "Unauthorized":
          return res.status(401).send(result);
        default:
          return res.status(400).send("unable to login");
      }
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