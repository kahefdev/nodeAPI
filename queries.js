const Pool = require('pg').Pool;
const cont = require('./controllers/lptController');
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'dvdrental',
  password: 'postgres',
  port: 5432,
});
exports.getUsers = (req, res) => {
  pool.query(
    `SELECT first_name,last_name FROM actor where actor_id=${req.params.id}`,
    (err, result) => {
      if (err) throw err;
      console.log(result.rows[0]);
      let { first_name, last_name } = result.rows[0];
      let tempx = cont.pgres(first_name, last_name);
      res.status(200).end(tempx);
    }
  );
};
