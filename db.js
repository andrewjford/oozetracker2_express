const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

pool.on('connect', () => {
  console.log('connected to the db');
});

/**
 * Create Tables
 */
const createExpenseTable = () => {
  const queryText =
    `CREATE TABLE IF NOT EXISTS
      expenses(
        id UUID PRIMARY KEY,
        amount NUMERIC(12,2) NOT NULL,
        created_date TIMESTAMP,
        modified_date TIMESTAMP,
        description text,
        category integer REFERENCES categories(id)
      )`;

  pool.query(queryText)
    .then((res) => {
      console.log(res);
      pool.end();
    })
    .catch((err) => {
      console.log(err);
      pool.end();
    });
}

const createCategoryTable = () => {
  const categoryTable =
  `CREATE TABLE IF NOT EXISTS
    categories(
      id SERIAL PRIMARY KEY,
      name varchar(64)
    )`;

  pool.query(categoryTable)
    .then((res) => {
      console.log(res);
      pool.end();
    })
    .catch((err) => {
      console.log(err);
      pool.end();
    });
}

/**
 * Drop Tables
 */
const dropTables = () => {
  const queryText = 'DROP TABLE IF EXISTS expenses';
  pool.query(queryText)
    .then((res) => {
      console.log(res);
      pool.end();
    })
    .catch((err) => {
      console.log(err);
      pool.end();
    });
}

pool.on('remove', () => {
  console.log('client removed');
  process.exit(0);
});

module.exports = {
  createExpenseTable,
  createCategoryTable,
  dropTables
};

require('make-runnable');