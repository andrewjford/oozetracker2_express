import db from '../services/dbService';
import moment from 'moment';

const CategoryModel = {
  create(req) {
    const text = `INSERT INTO
      categories(name, account_id)
      VALUES($1, $2)
      RETURNING *`;
    const values = [
      req.body.name,
      req.accountId
    ];
    return db.query(text, values);
  },

  getAll(req) {
    const findAllQuery = 'SELECT * FROM categories WHERE account_id = $1';
    return db.query(findAllQuery, [req.accountId]);
  },

  getOne(req) {
    const text = 'SELECT * FROM categories WHERE id = $1 AND account_id = $2';
    return db.query(text, [req.params.id, req.accountId]);
  },

  update(req, existingRecord) {
    const updateOneQuery =`UPDATE categories
      SET name = $1, modified_date = $2
      WHERE id = $3 RETURNING *`;

    const values = [
      req.body.name || existingRecord.name,
      moment(new Date()),
      req.params.id
    ];

    return db.query(updateOneQuery, values);
  },

  delete(req) {
    const deleteQuery = 'DELETE FROM categories WHERE id = $1 AND account_id = $2 RETURNING *';
    return db.query(deleteQuery, [req.params.id, req.accountId]);
  }

}

export default CategoryModel;