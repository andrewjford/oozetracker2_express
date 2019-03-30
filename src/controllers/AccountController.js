import AccountModel from '../models/AccountModel';

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