
// /src/routes/contactRoutes.js
const express = require('express');
const router = express.Router();
const Contact = require('../models/contact');
const { listContacts,updateContact,deleteContact,deleteContacts, ExportlistContacts } = require('../controllers/contactController');
const multer = require('multer');
const Response = require('../../config/responseHelper'); // Adjust the path as necessary


const ExcelJS = require('exceljs');
const storage = multer.memoryStorage(); // Menyimpan file di memory
const upload = multer({ storage: storage });

const { expressjwt: jwt } = require("express-jwt");

router.use(jwt({
  secret: 'your_secret_key',
  algorithms: ['HS256'],
  requestProperty: 'auth',
  credentialsRequired: false // Memungkinkan request tanpa token
}));


router.use((req, res, next) => {
  if (!req.auth || !req.auth.userId) {
    return Response("Harap kirimkan JWT", false, {}, 401, res);
  }
  next();
});

router.use((err, req, res, next) => {
  if (err instanceof UnauthorizedError) {
    let message = "Tidak ada akses"; // Default message
    if (err.code === 'token_expired') {
      message = "JWT telah kedaluwarsa"; 
    }
    return Response(message, false, {}, 401, res);
  }
  next(err);
});

router.post('/addContact', async (req, res) => {
  const userId = req.auth.userId; 
  const { name, phone, email } = req.body;
  try {
    await Contact.addContact(userId, name, phone, email);
    return Response("Contact added", false, { name, phone, email }, 200, res);

  } catch (error) {
    return Response(error.message, false, {}, 500, res);
  }
});

router.get('/', listContacts); // Rute untuk mendapatkan daftar kontak
router.put('/updateContact', updateContact);  //  HTTP method PUT
router.delete('/deleteContact', deleteContact);  //  HTTP  DELETE
router.delete('/deleteContacts', deleteContacts);

router.post('/importContacts', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      status: false,
      responseText: "No file uploaded"
    });
  }
  try {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(req.file.buffer);
    const worksheet = workbook.getWorksheet(1); // Asumsi data ada di sheet pertama
    let contacts = [];
    let rowError = false;

    worksheet.eachRow({ includeEmpty: false }, async (row, rowNumber) => {
      if (rowNumber > 1) { // Menghindari header
        const name = row.getCell(2).value;
        const phone = row.getCell(3).value;
        var email = row.getCell(4).value;
         // Periksa jika nilai email adalah objek dengan properti 'text'
          if (typeof email === 'object' && email.text) {
            email = email.text;
          } else if (typeof email === 'object' && email.hyperlink) {
            // Atau jika properti 'hyperlink' ada dan kamu ingin menggunakannya sebagai email
            email = email.hyperlink;
          }

          // Pastikan email adalah string sebelum memprosesnya
          if (typeof email !== 'string') {
            email = ''; // atau set nilai default atau tangani error
          }
        try {
          const result = await Contact.addContact(req.auth.userId, name, phone, email);
          contacts.push({ name, phone, email, inserted: true });
        } catch (error) {
          contacts.push({ name, phone, email, inserted: false, error: error.message });
          rowError = true;
        }
      }
    });

    if (rowError) {
      return res.status(500).json({
        status: false,
        responseText: "Some contacts failed to import",
        data: contacts
      });
    }

    res.status(200).json({
      status: true,
      responseText: "All contacts imported successfully",
      data: contacts
    });

  } catch (error) {
    res.status(500).json({
      status: false,
      responseText: "Error processing file",
      error: error.message
    });
  }
});
router.get('/export', ExportlistContacts); 

module.exports = router;