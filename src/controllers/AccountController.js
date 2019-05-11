import AccountModel from '../models/AccountModel';
import AccountValidator from '../validators/AccountValidator';
import mailer from '../services/mailer';

const AccountController = {
  async mail(req, res) {
    if (req.body.email) {
      mailer.sendMessage(req.body.email, '123');
      return res.status(200).send('done');
    }
    return res.status(400).send('negs');
  },

  async validateAccount(req, res) {
    res.status(200).send('validate endpoint hittered');
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