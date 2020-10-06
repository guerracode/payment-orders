const DataBase = require('../lib/db/mysql');

class ArticlesService {
  constructor() {
    this.dataBase = new DataBase();
    this.table = 'articles';
  }

  async getArticle(id) {
    try {
      const article = await this.dataBase.get(this.table, id);
      return article;
    } catch (error) {
      throw new Error(error);
    }
  }

  async getAllArticles() {
    try {
      const article = await this.dataBase.getAll(this.table);
      return article;
    } catch (error) {
      throw new Error(error);
    }
  }

  async createArticle(article) {
    try {
      await this.dataBase.create(this.table, article);
      return article;
    } catch (error) {
      throw new Error(error);
    }
  }

  async updateArticle(article) {
    try {
      await this.dataBase.update(this.table, article);
      return article;
    } catch (error) {
      throw new Error(error);
    }
  }

  async deleteArticle(article) {
    try {
      await this.dataBase.delete(this.table, article);
      return article;
    } catch (error) {
      throw new Error(error);
    }
  }
}

module.exports = ArticlesService;
