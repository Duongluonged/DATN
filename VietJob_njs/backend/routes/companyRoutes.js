const express = require('express');
const router = express.Router();
const companyController = require('../controllers/companyController');

// Định nghĩa đường dẫn
router.get('/top-companies', companyController.getTopCompanies);

module.exports = router;