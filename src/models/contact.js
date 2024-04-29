
// /src/models/contact.js
const db = require('../../config/database');

class Contact {
  static async addContact(userId, name, phone, email) {
    const [result] = await db.execute(
      'INSERT INTO contacts (userId, name, phone, email) VALUES (?, ?, ?, ?)',
      [userId, name, phone, email]
    );
    return result;
  }
  static async findByUserId(userId) {
    const [contacts] = await db.execute(
      'SELECT * FROM contacts WHERE userId = ?',
      [userId]
    );
    return contacts;
  }
  static async findAll() {
    const [contacts] = await db.execute('SELECT * FROM contacts');
    return contacts;
  }

  static async updateContact(id, userId, name, phone, email) {
    const [result] = await db.execute(
      'UPDATE contacts SET name = ?, phone = ?, email = ? WHERE id = ? AND userId = ?',
      [name, phone, email, id, userId]
    );
    if (result.affectedRows) {
      return { id, name, phone, email };
    } else {
      return null; // Tidak ada baris yang terupdate, mungkin karena ID salah atau bukan pemilik kontak
    }
  }
  static async deleteContact(id, userId) {
    const [result] = await db.execute(
      'DELETE FROM contacts WHERE id = ? AND userId = ?',
      [id, userId]
    );
    if (result.affectedRows) {
      return true; // Mengembalikan true jika penghapusan berhasil
    } else {
      return false; // Mengembalikan false jika tidak ada kontak yang dihapus
    }
  }

  static async deleteContacts(ids, userId) {
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction(); // Mulai transaksi

      const [result] = await connection.query(
        `DELETE FROM contacts WHERE id IN (?) AND userId = ?`,
        [ids, userId]
      );

      if (result.affectedRows === 0) {
        throw new Error("No rows affected"); // Buat error jika tidak ada baris yang terpengaruh
      }

      await connection.commit(); // Commit transaksi jika semuanya ok
      return result.affectedRows;
    } catch (error) {
      await connection.rollback(); // Rollback transaksi jika ada error
      throw error; // Biarkan error ditangani di luar fungsi
    } finally {
      connection.release(); // Lepaskan koneksi kembali ke pool
    }
  }
  // Add methods for delete, update, and search
}
module.exports = Contact;
