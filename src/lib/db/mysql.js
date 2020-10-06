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
    let articles;
    if (table === 'orders' && data.articles) {
      articles = data.articles;
      // eslint-disable-next-line no-param-reassign
      delete data.articles;
    }
    let sql = SqlString.format(`INSERT INTO ${table} SET ?`, [data]);

    try {
      const [rows] = await con.execute(sql);

      if (table === 'orders' && articles) {
        articles.forEach(async (article) => {
          sql = SqlString.format(
            `INSERT INTO orders_articles (id_order, id_article, articles_number) VALUES (${rows.insertId}, ${article.id}, ${article.number}); `
          );
          await con.execute(sql);
        });
      }

      return rows.insertId;
    } catch (error) {
      throw new Error(boom.unauthorized(error));
    }
  }

  async update(table, data) {
    const con = await mysql.createConnection(this.dbConfig);
    let articles;
    let sql;
    if (table === 'orders' && data.articles) {
      articles = data.articles;
      // eslint-disable-next-line no-param-reassign
      delete data.articles;
    }

    try {
      if (data.name || data.description) {
        sql = SqlString.format(`UPDATE ${table} SET ? WHERE id=?`, [data, data.id]);
        await con.execute(sql);
      }
      if (table === 'orders' && data.articles) {
        articles.forEach(async (article) => {
          sql = SqlString.format(
            `UPDATE orders_articles SET articles_number=${article.number} WHERE id_order=${data.id} AND id_article=${article.id}`
          );
          await con.execute(sql);
        });
      }
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

  async frequent(number) {
    const con = await mysql.createConnection(this.dbConfig);
    const sql = SqlString.format(
      `SELECT oa.id_article, a.name, SUM(oa.articles_number) as sum FROM orders_articles AS oa JOIN articles AS a ON oa.id_article = a.id GROUP BY id_article ORDER BY sum DESC LIMIT ${number}`
    );

    try {
      const [frequent] = await con.execute(sql);
      return frequent;
    } catch (error) {
      throw new Error(boom.unauthorized(error));
    }
  }

  async getDates(param, value) {
    const con = await mysql.createConnection(this.dbConfig);
    let query = `SELECT o.name as order_name, o.date, o.id_user, a.name as article_name, oa.articles_number FROM orders as o JOIN orders_articles as oa ON o.id = oa.id_order JOIN articles as a ON a.id = oa.id_article `;

    if (value === 'after') {
      query = query.concat(`WHERE o.date >= ${param} `);
    } else if (value === 'before') {
      query = query.concat(`WHERE o.date <= ${param} `);
    } else if (value === 'between') {
      query = query.concat(`WHERE o.date >= ${param.start} AND o.date <= ${param.end} `);
    }
    query = query.concat(`ORDER BY date DESC;`);
    const sql = SqlString.format(query);

    try {
      const [frequent] = await con.execute(sql);
      return frequent;
    } catch (error) {
      throw new Error(boom.unauthorized(error));
    }
  }
}

module.exports = DatabaseMySQL;
