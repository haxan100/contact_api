const Contact = require('../models/contact');
const ExcelJS = require('exceljs');
const Response = require('../../config/responseHelper'); // Adjust the path as necessary


const listContacts = async (req, res) => {
  const userId = req.auth.userId;  // This assumes the userId is being extracted from auth data
  // const { userId } = req.query; // Uncomment this line to take userId from query parameters if needed
  try {
    const contacts = await Contact.findByUserId(userId);
    return Response("Contacts retrieved successfully", true, contacts, 200, res);
  } catch (error) {
    return Response("Failed to retrieve contacts", false, {}, 500, res);
  }
};
const updateContact = async (req, res) => {
  const userId = req.auth.userId;  // Authentication user ID
  const { id, name, phone, email } = req.body;  // Contact details from the request body

  try {
    const updatedContact = await Contact.updateContact(id, userId, name, phone, email);
    if (updatedContact) {
      return Response('Kontak berhasil diupdate', true, updatedContact, 200, res);
    } else {
      return Response('Kontak tidak ditemukan atau tidak dapat diupdate', false, {}, 404, res);
    }
  } catch (error) {
    return Response('Terjadi kesalahan saat mengupdate kontak', false, {}, 500, res);
  }
};

const deleteContact = async (req, res) => {
  const userId = req.auth.userId;  // Assuming the userId is being extracted correctly
  const { id } = req.body;  // Contact ID from the request body
  try {
    const success = await Contact.deleteContact(id, userId);
    if (success) {
      return  Response( 'Kontak berhasil dihapus',true,{},200,res );
    } else {
      Response('Kontak tidak ditemukan atau tidak bisa dihapus', false, {}, 404, res);
    }
  } catch (error) {
    Response('Terjadi kesalahan saat menghapus kontak', false, {}, 500, res);
  }
};
const deleteContacts = async (req, res) => {
    const userId = req.auth.userId;
    const { ids } = req.body;
    try {
      const affectedRows = await Contact.deleteContacts(ids, userId);
      Response(`${affectedRows} kontak berhasil dihapus`, true, {}, 200, res);
    } catch (error) {
      Response('Gagal menghapus kontak', false, { error: error.message }, 500, res);
    }
}
const ExportlistContacts = async (req, res) => {
  const userId = req.auth.userId;
  try {
    const contacts = await Contact.findByUserId(userId) ;
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Contacts');
    worksheet.columns = [
      { header: 'ID', key: 'id', width: 5 },
      { header: 'Name', key: 'name', width: 30 },
      { header: 'Phone', key: 'phone', width: 15 },
      { header: 'Email', key: 'email', width: 30 }
    ];
    contacts.forEach(contact => {
      worksheet.addRow(contact);
    });
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.setHeader(
      'Content-Disposition',
      'attachment; filename=' + 'contacts.xlsx'
    );
    await workbook.xlsx.write(res);

  } catch (error) {
    res.status(500).send(error.message);
  }
}

module.exports = { listContacts,updateContact,deleteContact,deleteContacts ,ExportlistContacts};