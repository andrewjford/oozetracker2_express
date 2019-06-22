import AccountModel from '../models/AccountModel';
import AccountValidator from '../validators/AccountValidator';
import VerificationTokenController from './VerificationTokenController';
import db from '../services/dbService';
import models from '../models/models';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import mailer from '../services/mailer';
import CategoryModel from '../models/CategoryModel';

const AccountController = {
  async validateAccount(req, res) {
    const query = `SELECT v.*, a.*
      FROM verification_tokens v 
      LEFT JOIN accounts a ON v.account_id = a.id
      WHERE v.token = $1`;
    const { rows } = await db.query(query, [req.query.token]);

    if (rows && rows.length > 0) {
      try {
        const updatedAccount = await models.Account.update(
          {isVerified: true},
          {where: {id: rows[0].id}}
        );

        models.VerificationToken.destroy({
          where: {account_id: rows[0].id}
        });
        return res.status(200).send({message: "email successfully verified"});
      } catch(error) {
        console.log('error updating account... '+error);
        return res.status(500).send({message: "internal server error"});
      }
    } else {
      return res.status(400).send({message: "Unable to resolve email verification."});
    }
  },

  async create(req, res) {
    const errors = AccountValidator.onCreate(req);
    if (errors.length > 0) {
      return res.status(422).send({ message: errors });
    }

    try {
      const password = await bcrypt.hash(req.body.password, 10);
      const account = await models.Account.create({
        name: req.body.name,
        email: req.body.email,
        password,
      })
      .catch(error => {
        if (error.parent.code === '23505') {
          return res.status(422).send({message: ["A user already exists for this email."]});
        } else {
          throw Error(error);
        }
      });

      const verificationTokenModel = await VerificationTokenController.create(req, res, account);
      mailer.sendVerificationMessage(account.email, verificationTokenModel.token)
        .catch(error => {
          console.log(`error sending email: ${error}`);
          return res.status(500).send({message: "Error sending email."});
        });

      CategoryModel.create({
        body: {
          name: "Groceries",
        },
        accountId: account.id
      });

      const tokenExpiration = 24*60*60;
      const token = jwt.sign({id: account.id}, process.env.SECRET_KEY, {expiresIn: tokenExpiration});

      return res.status(201).send({
        user: account, // prob need to strip this down
        token,
        tokenExpiration
      });
    } catch(error) {
      return res.status(400).send({message: ["error creating user"]});
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
      const result = models.Account.destroy({
        where: {id: req.accountId}
      });
      if(result.rowCount === 0) {
        return res.status(404).send({'message': 'account not found'});
      }
      return res.status(204).send({ 'message': 'deleted' });
    } catch(error) {
      console.log(error);
      return res.status(400).send(error);
    }
  }
}

export default AccountController;