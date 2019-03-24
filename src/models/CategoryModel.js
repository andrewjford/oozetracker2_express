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
  }
}

export default CategoryModel;