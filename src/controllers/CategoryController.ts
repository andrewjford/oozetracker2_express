import models from "../models/models";
import moment from "moment";

const CategoryController = {
  async create(req, res) {
    return models.Category.create({
      name: req.body.name,
      account_id: req.accountId,
    })
      .then((result) => {
        return res.status(201).send(result);
      })
      .catch((error) => {
        console.log(`error creating category: ${error}`);
        return res.status(500).send({ message: "Internal Server error." });
      });
  },

  async getAll(req, res) {
    try {
      const categories: any[] = await models.Category.findAll({
        where: {
          account_id: req.accountId,
        },
      });
      return res.status(200).send({
        rows: categories,
        rowCount: categories.length,
      });
    } catch (error) {
      return res.status(400).send(error);
    }
  },

  async getOne(req, res) {
    try {
      const category = await models.Category.findOne({
        where: {
          id: req.params.id,
          account_id: req.accountId,
        },
      });

      if (!category) {
        return res.status(404).send({ message: "category not found" });
      }
      return res.status(200).send(category);
    } catch (error) {
      return res.status(400).send(error);
    }
  },

  async update(req, res) {
    try {
      const category = await models.Category.findOne({
        where: {
          id: req.params.id,
          account_id: req.accountId,
        },
      });

      if (!category) {
        return res.status(404).send({ message: "category not found" });
      }

      const [count, updatedCategories] = await models.Category.update(
        {
          name: req.body.name,
          updated_at: moment(new Date()),
        },
        {
          where: { id: category.id },
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
      const destroyedCount = await models.Category.destroy({
        where: {
          id: req.params.id,
          account_id: req.accountId,
        },
      });

      if (destroyedCount === 0) {
        return res.status(404).send({ message: "category not found" });
      }
      return res.status(204).send({ message: "deleted" });
    } catch (error) {
      return res.status(400).send(error);
    }
  },
};

export default CategoryController;
