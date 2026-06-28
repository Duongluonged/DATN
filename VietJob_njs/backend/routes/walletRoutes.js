const express = require('express');
const router = express.Router();
const {
    getWalletInfo,
    depositMoney,
    highlightJob,
    sellCourse
} = require('../controllers/walletController');

router.get('/info/:userId', getWalletInfo);

router.post('/deposit', depositMoney);

router.post('/highlight', highlightJob);

router.post('/sell-course', sellCourse);

module.exports = router;
