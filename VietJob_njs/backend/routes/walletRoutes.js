const express = require('express');
const router = express.Router();
const {
    getWalletInfo,
    depositMoney,
    highlightJob,
    sellCourse
} = require('../controllers/walletController');

// Lấy thông tin ví & Lịch sử
router.get('/info/:userId', getWalletInfo);

// Nạp tiền vào ví
router.post('/deposit', depositMoney);

// Làm nổi bật tin đăng VIP
router.post('/highlight', highlightJob);

// Ghi nhận bán khóa học chia sẻ % doanh thu
router.post('/sell-course', sellCourse);

module.exports = router;
