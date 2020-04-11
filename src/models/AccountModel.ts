import db from "../services/dbService";
import bcrypt from "bcryptjs";
import JwtToken from "../services/JwtToken";
import models from "./models";

const AccountModel = {
  async getOne(req) {
    const text = "SELECT * FROM accounts WHERE id = $1";
    return db.query(text, [req.params.id]);
  },

  async getByEmail(email) {
    const queryText = "SELECT * FROM accounts WHERE email = $1";
    return db.query(queryText, [email]);
  },

  async login(req) {
    const { rows } = await this.getByEmail(req.body.email.toLowerCase());
    const user = rows[0];
    if (!user) {
      return {
        status: "Not Found",
        message: "Account not found for provided email",
      };
    }

    const passwordIsCorrect = bcrypt.compareSync(
      req.body.password,
      user.password
    );
    if (!passwordIsCorrect) {
      return { status: "Unauthorized", message: "Password not valid" };
    }

    const jwtToken = new JwtToken();
    const tokenExpiration = jwtToken.requestToTokenExpiration(req);
    const token = jwtToken.generate(user.id, tokenExpiration);

    return {
      status: "Success",
      user: { id: user.id },
      token,
      tokenExpiration,
    };
  },

  async validateAccount(req) {
    const query = `SELECT v.*, a.*
      FROM verification_tokens v 
      LEFT JOIN accounts a ON v.account_id = a.id
      WHERE v.token = $1`;

    //@ts-ignore
    const { rows } = await db.query(query, [req.query.token]);
    if (rows && rows.length > 0) {
      // update account
      // delete verification token
      console.log(rows[0]);
    }
  },

  async update(user, newChanges) {
    const colsToUpdate: any = {};
    if (newChanges.newPassword) {
      const passwordIsCorrect = bcrypt.compareSync(
        newChanges.oldPassword,
        user.password
      );

      if (!passwordIsCorrect) {
        const error: any = new Error("Old password not valid");
        error.code = 400;
        error.status = "Unauthorized";

        throw error;
      }

      const password = await bcrypt.hash(newChanges.newPassword, 10);

      colsToUpdate.password = password;
    }

    if (newChanges.name) {
      colsToUpdate.name = newChanges.name;
    }

    return models.Account.update(colsToUpdate, {
      where: { id: user.id },
    });
  },
};

export default AccountModel;
