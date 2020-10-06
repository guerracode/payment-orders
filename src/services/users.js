const bcrypt = require('bcrypt');
const DataBase = require('../lib/db/mysql');

class UserService {
  constructor() {
    this.dataBase = new DataBase();
    this.table = 'users';
  }

  async getUser(username) {
    try {
      const user = await this.dataBase.get(this.table, username, 'username');
      return user;
    } catch (error) {
      throw new Error(error);
    }
  }

  async createUser(user) {
    const { username, password } = user;

    try {
      // hash the password to be secure
      const hashedPassword = await bcrypt.hash(password, 10);

      await this.dataBase.create(this.table, {
        username,
        password: hashedPassword,
      });

      return username;
    } catch (error) {
      throw new Error(error);
    }
  }
}

module.exports = UserService;
