const router = require('express').Router();
const { verifyToken, isAdmin } = require('../middlewares/authMiddlewares');
const { getEmployers, updateStatus, getDashboardStats, getSystemTransactions } = require('../controllers/adminController');

router.get('/stats', getDashboardStats);
router.get('/transactions', getSystemTransactions);

router.use(verifyToken, isAdmin);
router.get('/employers', getEmployers);
router.patch('/employers/:id/status', updateStatus);
module.exports = router;