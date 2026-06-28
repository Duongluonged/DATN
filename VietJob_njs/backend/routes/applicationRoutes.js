const express = require('express');
const router = express.Router();
const {
    postApplyJob,
    getApplicationsByEmployer,
    updateApplicationStatus,
    getApplicationsByCandidate
} = require('../controllers/applicationController');

router.post('/apply', postApplyJob);

router.get('/employer/:userId', getApplicationsByEmployer);

router.get('/candidate/:userId', getApplicationsByCandidate);

router.patch('/:applicationId/status', updateApplicationStatus);

module.exports = router;
