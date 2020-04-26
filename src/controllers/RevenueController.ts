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

  async getOne(req, res) {
    try {
      const revenue = await models.Revenue.findOne({
        where: {
          id: req.params.id,
          account_id: req.accountId,
        },
      });

      if (!revenue) {
        return res.status(404).send({ message: "Record not found" });
      }
      return res.status(200).send(revenue);
    } catch (error) {
      return res.status(400).send(error);
    }
  },

  async update(req, res) {
    try {
      const revenue = await models.Revenue.findOne({
        where: {
          id: req.params.id,
          account_id: req.accountId,
        },
      });

      if (!revenue) {
        return res.status(404).send({ message: "Record not found" });
      }

      const [count, updatedCategories] = await models.Revenue.update(
        {
          description: req.body.description,
          amount: req.body.amount,
        },
        {
          where: { id: revenue.id },
          returning: true,
        }
      );

      return res.status(200).send(updatedCategories[0]);
    } catch (err) {
      console.log(err);
      return res.status(400).send(err);
    }
  },

  async delete(req, res) {
    try {
      const destroyedCount = await models.Revenue.destroy({
        where: {
          id: req.params.id,
          account_id: req.accountId,
        },
      });

      if (destroyedCount === 0) {
        return res.status(404).send({ message: "expense not found" });
      }

      return res.status(204).send({ message: "deleted" });
    } catch (error) {
      return res.status(400).send(error);
    }
  },
};
