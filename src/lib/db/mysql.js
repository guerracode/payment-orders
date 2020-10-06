const mysql = require('mysql2/promise');
const boom = require('@hapi/boom');
const SqlString = require('sqlstring');
const config = require('../../config/index');

class DatabaseMySQL {
  constructor() {
    this.dbConfig = config.mysql;
  }

  async get(table, data, search = 'id') {
    try {
      const con = await mysql.createConnection(this.dbConfig);
      const sql = SqlString.format(`SELECT * FROM ${table} WHERE ${search}=?`, [data]);

      const [rows] = await con.execute(sql);
      return rows[0];
    } catch (error) {
      throw new Error(error);
    }
  }

  async getAll(table) {
    try {
      const con = await mysql.createConnection(this.dbConfig);
      const sql = SqlString.format(`SELECT * FROM ${table}`);

      const [rows] = await con.execute(sql);
      return rows;
    } catch (error) {
      throw new Error(error);
    }
  }

  async create(table, data) {
    const con = await mysql.createConnection(this.dbConfig);
    const sql = SqlString.format(`INSERT INTO ${table} SET ?`, [data]);

    try {
      await con.execute(sql);
      return true;
    } catch (error) {
      throw new Error(boom.unauthorized(error));
    }
  }

  async update(table, data) {
    const con = await mysql.createConnection(this.dbConfig);
    const sql = SqlString.format(`UPDATE ${table} SET ? WHERE id=?`, [data, data.id]);

    try {
      await con.execute(sql);
      return true;
    } catch (error) {
      throw new Error(boom.unauthorized(error));
    }
  }

  async delete(table, data) {
    const con = await mysql.createConnection(this.dbConfig);
    const sql = SqlString.format(`DELETE FROM ${table} WHERE id=?`, [data]);

    try {
      await con.execute(sql);
      return true;
    } catch (error) {
      throw new Error(boom.unauthorized(error));
    }
  }
}

module.exports = DatabaseMySQL;
