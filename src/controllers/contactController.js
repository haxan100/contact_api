const Contact = require('../models/contact');

// const listContacts = async (req, res) => {
//   const { userId } = req.query; // Mengambil userId dari query, misal `/api/contacts?userId=1`
//   try {
//     const contacts = await Contact.findByUserId(userId);
//     res.status(200).json(contacts);
//   } catch (error) {
//     res.status(500).send(error.message);
//   }
// };
const listContacts = async (req, res) => {
    const userId = req.auth.userId;
    // const { userId } = req.query; // Mengambil userId dari query jika ada
    try {
      const contacts = await Contact.findByUserId(userId) ;
      res.status(200).json(contacts);
    } catch (error) {
      res.status(500).send(error.message);
    }
}
const updateContact = async (req, res) => {
    const userId = req.auth.userId;
    const { id, name, phone, email } = req.body;
    try {
      const updatedContact = await Contact.updateContact(id, userId, name, phone, email);
      if (updatedContact) {
        res.status(200).json({
          status: true,
          message: 'Kontak berhasil diupdate',
          data: updatedContact
        });
      } else {
        res.status(404).json({
          status: false,
          message: 'Kontak tidak ditemukan atau tidak dapat diupdate'
        });
      }
    } catch (error) {
      res.status(500).json({
        status: false,
        message: 'Terjadi kesalahan saat mengupdate kontak',
        error: error.message
      });
    }
};
const deleteContact = async (req, res) => {
    const userId = req.auth.userId;
    const { id } = req.body; // Mengambil ID kontak dari body request
    try {
      const success = await Contact.deleteContact(id, userId);
      if (success) {
        res.status(200).json({
          status: true,
          message: 'Kontak berhasil dihapus'
        });
      } else {
        res.status(404).json({
          status: false,
          message: 'Kontak tidak ditemukan atau tidak bisa dihapus'
        });
      }
    } catch (error) {
      res.status(500).json({
        status: false,
        message: 'Terjadi kesalahan saat menghapus kontak',
        error: error.message
      });
    }
};
const deleteContacts = async (req, res) => {
    const userId = req.auth.userId;
    const { ids } = req.body;
    try {
      const affectedRows = await Contact.deleteContacts(ids, userId);
      res.status(200).json({
        status: true,
        message: `${affectedRows} kontak berhasil dihapus`
      });
    } catch (error) {
      res.status(500).json({
        status: false,
        message: 'Gagal menghapus kontak',
        error: error.message
      });
    }
}

module.exports = { listContacts,updateContact,deleteContact,deleteContacts };