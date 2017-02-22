export default {
  development: {
    username: process.env.MYSQL_LOGIN,
    password: process.env.MYSQL_PASS,
    database: `${process.env.MYSQL_DBNAME}_development`,
    host: process.env.MYSQL,
    dialect: 'mysql'
  },
  test: {
    username: process.env.MYSQL_LOGIN,
    password: process.env.MYSQL_PASS,
    database: `${process.env.MYSQL_DBNAME}_test`,
    host: process.env.MYSQL,
    dialect: 'mysql'
  },
  production: {
    username: process.env.MYSQL_LOGIN,
    password: process.env.MYSQL_PASS,
    database: `${process.env.MYSQL_DBNAME}`,
    host: process.env.MYSQL,
    dialect: 'mysql'
  }
};
