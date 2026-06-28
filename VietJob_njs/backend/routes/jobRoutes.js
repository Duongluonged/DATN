const express = require('express');
const router = express.Router();
const {
    searchJobs,
    getJobDetail,
    getJobsByEmployer,
    createJob,
    updateJob,
    deleteJob,
    getAllJobsAdmin,
    toggleJobStatus,
    getEmployerStats
} = require('../controllers/Jobcontroller');

router.get('/search', searchJobs);

router.get('/admin/all', getAllJobsAdmin);

router.put('/admin/status/:jobId', toggleJobStatus);

router.get('/employer/:userId', getJobsByEmployer);

router.get('/employer/:userId/stats', getEmployerStats);

router.post('/employer/:userId', createJob);

router.put('/:jobId', updateJob);

router.delete('/:jobId', deleteJob);

router.get('/:id', getJobDetail);

module.exports = router;