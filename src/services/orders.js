const DataBase = require('../lib/db/mysql');

class OrdersService {
  constructor() {
    this.dataBase = new DataBase();
    this.table = 'orders';
  }

  async getOrder(id) {
    try {
      const order = await this.dataBase.get(this.table, id);
      return order;
    } catch (error) {
      throw new Error(error);
    }
  }

  async getAllOrders() {
    try {
      const order = await this.dataBase.getAll(this.table);
      return order;
    } catch (error) {
      throw new Error(error);
    }
  }

  async createOrder(order) {
    try {
      let result = await this.dataBase.create(this.table, order);
      result = { id: result, ...order };
      return result;
    } catch (error) {
      throw new Error(error);
    }
  }

  async updateOrder(order) {
    try {
      await this.dataBase.update(this.table, order);
      return order;
    } catch (error) {
      throw new Error(error);
    }
  }

  async deleteOrder(order) {
    try {
      await this.dataBase.delete(this.table, order);
      return order;
    } catch (error) {
      throw new Error(error);
    }
  }

  async getDates(param, value) {
    try {
      const dates = await this.dataBase.getDates(param, value);
      return dates;
    } catch (error) {
      throw new Error(error);
    }
  }
}

module.exports = OrdersService;
