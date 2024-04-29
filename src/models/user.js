const db = require('../../config/database');
const bcrypt = require('bcrypt');
const saltRounds = 10;
class User {
    static async create(username, password) {
    const hashedPassword = await bcrypt.hash(password, saltRounds);

      const [result] = await db.execute(
        'INSERT INTO users (username, password) VALUES (?, ?)',
            [username, hashedPassword]
        );
      return result;
    }
    
  static async findByUsernameAndPassword(username, password) {
        const [users] = await db.execute(
        'SELECT * FROM users WHERE username = ?',
        [username]
        );

        if (users.length === 0) {
        return null; // User not found
        }

        const user = users[0];
        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {
        return user; // Return user data if password is correct
        } else {
        return null; // Return null if password is incorrect
        }

    }

  
    // Add more methods as needed
  }
  
  module.exports = User;
  