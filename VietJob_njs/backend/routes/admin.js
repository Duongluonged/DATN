const router = require('express').Router();
const { verifyToken, isAdmin } = require('../middlewares/authMiddleware');
const { getEmployers, updateStatus } = require('../controllers/adminController');

router.use(verifyToken, isAdmin);
router.get('/employers', getEmployers);                    // ?status=pending&page=1
router.patch('/employers/:id/status', updateStatus);       // body: { status, reason }
module.exports = router;