const mysql = require('mysql2/promise');
const boom = require('@hapi/boom');
const config = require('../../config/index');

const dbConfig = config.mysql;

class DatabaseMySQL {
  constructor() {
    this.connection = undefined;
    this.handleConnection();
  }

  async handleConnection() {
    try {
      this.connection = await mysql.createConnection(dbConfig);
      console.log('Connected!');
    } catch (error) {
      throw new Error(error);
    }
  }

  async getUser(data) {
    try {
      const [rows] = await this.connection.execute(`SELECT * FROM users WHERE username='${data}'`);
      console.log('RESULT GET', rows[0].username);
      return rows[0].username;
    } catch (error) {
      return undefined;
    }
  }

  async createUser(data) {
    const { username, password } = data;
    try {
      const result = await this.connection.execute(
        `INSERT INTO users (username, password) VALUES ('${username}', '${password}')`
      );
      console.log('ResultQUery', result);
      return result;
    } catch (error) {
      throw new Error(boom.unauthorized('User already Exist'));
    }
  }
}

module.exports = DatabaseMySQL;
