const express = require('express');
const router = express.Router();
const companyController = require('../controllers/companyController');
const jobController = require('../controllers/Jobcontroller');

// Định nghĩa đường dẫn
router.get('/top-companies', companyController.getTopCompanies);
router.get('/employer/:userId', companyController.getCompanyByEmployer);
router.put('/employer/:userId', companyController.updateCompanyByEmployer);
router.get('/:id', companyController.getCompanyDetail);
router.get('/:id/jobs', companyController.getCompanyJobs);
router.get('/jobs/:id', jobController.getJobDetail);

module.exports = router;