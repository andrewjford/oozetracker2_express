import models from '../models/models';
import mailer from '../services/mailer';
import bcrypt from 'bcryptjs';

const VerificationTokenController = {
  async resendEmailVerification(req, res) {
    const account = await models.Account.findOne({
      where: {email: req.query.email},
      include: [{
        model: models.VerificationToken,
        as: "VerificationToken",
      }],
    });

    if (account && account.VerificationToken) {
      mailer.sendVerificationMessage(account.email, account.VerificationToken.token)
        .then(() => {
          return res.status(200).send({message: "Verification email sent."});
        });
    } else if (account) {
      const newVerificationToken = await this.create(req, res, account);
      mailer.sendVerificationMessage(account.email, newVerificationToken.token)
        .then(() => {
          return res.status(200).send({message: "Verification email sent."});
        });
    } else {
      return res.status(404).send({message: "Account not found for given email."});
    }
  },

  async create(req, res, account) {
    const newToken = await bcrypt.hash(account.email, 10);
    return models.VerificationToken.create({
        token: newToken,
        account_id: account.id
      })
      .catch(error => {
        console.log(`error creating verification token: ${error}`);
        return res.status(500).send({message: "Internal Server error."});
      });
  }
}

export default VerificationTokenController;