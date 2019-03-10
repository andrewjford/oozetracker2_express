import db from '../services/dbService';

const Report = {

  async getMonthly(req, res) {
    const requestedMonth = new Date(req.body.year, req.body.month);
    const nextMonth = new Date(req.body.year, req.body.month);
    nextMonth.setMonth(nextMonth.getMonth() + 1);

    const queryString = `
      SELECT SUM(e.amount), c.id, c.name
      FROM expenses e 
      LEFT JOIN categories c ON e.category = c.id
      WHERE e.date >= $1 AND
        e.date < $2 AND
        e.account_id = $3
      GROUP BY c.id`;

    const values = [
      `${requestedMonth.getFullYear()}-${requestedMonth.getMonth()+1}-01`,
      `${nextMonth.getFullYear()}-${nextMonth.getMonth()+1}-01`,
      req.accountId,
    ];

    try {
      const { rows, rowCount } = await db.query(queryString, values);
      return res.status(200).send({
        rows, 
        rowCount,
        month: req.body.month,
        year: req.body.year,
      });
    } catch(error) {
      console.log(error)
      return res.status(400).send(error)
    }
  },
}

export default Report;