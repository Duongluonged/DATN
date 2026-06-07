const router = require('express').Router();
const { verifyToken, isAdmin } = require('../middlewares/authMiddlewares');
const { getEmployers, updateStatus, getDashboardStats, getSystemTransactions } = require('../controllers/adminController');

// Stats không cần auth để frontend admin có thể fetch dễ dàng
router.get('/stats', getDashboardStats);
router.get('/transactions', getSystemTransactions);

router.use(verifyToken, isAdmin);
router.get('/employers', getEmployers);                    // ?status=pending&page=1
router.patch('/employers/:id/status', updateStatus);       // body: { status, reason }
module.exports = router;