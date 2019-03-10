'use strict';

var _require = require('pg'),
    Pool = _require.Pool;

var dotenv = require('dotenv');

dotenv.config();

var pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

pool.on('connect', function () {
  console.log('connected to the db');
});

/**
 * Create Tables
 */
var createExpenseTable = function createExpenseTable() {
  var queryText = 'CREATE TABLE IF NOT EXISTS\n      expenses(\n        id UUID PRIMARY KEY,\n        amount NUMERIC(12,2) NOT NULL,\n        created_date TIMESTAMP,\n        modified_date TIMESTAMP,\n        description text,\n        category integer REFERENCES categories(id)\n      )';

  pool.query(queryText).then(function (res) {
    console.log(res);
    pool.end();
  }).catch(function (err) {
    console.log(err);
    pool.end();
  });
};

var createCategoryTable = function createCategoryTable() {
  var categoryTable = 'CREATE TABLE IF NOT EXISTS\n    categories(\n      id SERIAL PRIMARY KEY,\n      name varchar(64)\n    )';

  pool.query(categoryTable).then(function (res) {
    console.log(res);
    pool.end();
  }).catch(function (err) {
    console.log(err);
    pool.end();
  });
};

/**
 * Drop Tables
 */
var dropTables = function dropTables() {
  var queryText = 'DROP TABLE IF EXISTS expenses';
  pool.query(queryText).then(function (res) {
    console.log(res);
    pool.end();
  }).catch(function (err) {
    console.log(err);
    pool.end();
  });
};

pool.on('remove', function () {
  console.log('client removed');
  process.exit(0);
});

module.exports = {
  createExpenseTable: createExpenseTable,
  createCategoryTable: createCategoryTable,
  dropTables: dropTables
};

require('make-runnable');