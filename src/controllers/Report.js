import moment from 'moment';
import uuidv4 from 'uuid/v4';
import db from '../db';

const Report = {

  async getMonthly(req, res) {
    const nextMonth = parseInt(req.body.month) + 1;
    const text = `
      SELECT SUM(e.amount), c.id, c.name
      FROM expenses e 
      LEFT JOIN categories c ON e.category = c.id
      WHERE e.created_date >= $1 AND
        e.created_date < $2
      GROUP BY c.id`;
    const values = [
      `${req.body.year}-${req.body.month}-01`,
      `${req.body.year}-${nextMonth.toString()}-01`,
    ];
    try {
      const { rows, rowCount } = await db.query(text, values);
      return res.status(200).send({
        rows, 
        rowCount,
        month: req.body.month,
        year: req.body.year,
      });
    } catch(error) {
      return res.status(400).send(error)
    }
  },
}

export default Report;