const fs = require('fs');
var DB = JSON.parse(fs.readFileSync('config/config.json', 'utf8')).production;

module.exports = {
  username: DB.username,
  password: DB.password,
  database: DB.database,
  host: DB.host,
  dialect: DB.dialect,
  pool: {
    max: 10,
    min: 5
  }
};
