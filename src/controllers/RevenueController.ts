import models from "../models/models";

export const RevenueController = {
  async create(req, res) {
    return models.Revenue.create({
      description: req.body.description,
      amount: req.body.amount,
      date: req.body.date || new Date(),
      account_id: req.accountId,
    })
      .then((result) => {
        return res.status(201).send(result);
      })
      .catch((error) => {
        console.log(`error creating revenue: ${error}`);
        return res.status(500).send({ message: "Internal Server error." });
      });
  },

  async getAll(req, res) {
    return models.Revenue.findAll({
      where: {
        account_id: req.accountId,
      },
    })
      .then((result) => {
        return res.status(200).send({
          rows: result,
          rowCount: result.length,
        });
      })
      .catch((error) => {
        return res.status(400).send(error);
      });
  },
};
