const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/social-login", authController.socialLogin);
router.post("/google-callback",   authController.googleCallback);
router.post("/linkedin-callback", authController.linkedInCallback);

const { registerEmployer } = require('../controllers/authController');
const { getAllUsers, approveRecruiter, rejectRecruiter, getProfile, updateProfile, deleteUser, changePassword } = require('../controllers/adminController');

router.post('/register/employer', registerEmployer);
router.get('/users', getAllUsers);
router.post('/approve', approveRecruiter);
router.post('/reject', rejectRecruiter);
router.delete('/users/:userId', deleteUser);

router.get('/profile/:userId', getProfile);
router.put('/profile/:userId', updateProfile);

router.put('/profile/:userId/password', changePassword);

module.exports = router;