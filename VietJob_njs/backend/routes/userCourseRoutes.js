const express = require('express');
const router = express.Router();
const { 
    getUserCourses, 
    addUserCourse, 
    removeUserCourse, 
    enrollUserCourse 
} = require('../controllers/userCourseController');

// Lấy danh sách lộ trình của người dùng: GET /api/user-courses/:userId
router.get('/:userId', getUserCourses);

// Thêm vào danh sách quan tâm: POST /api/user-courses/add
router.post('/add', addUserCourse);

// Gỡ bỏ khỏi lộ trình: POST /api/user-courses/remove
router.post('/remove', removeUserCourse);

// Đăng ký học lộ trình: POST /api/user-courses/enroll
router.post('/enroll', enrollUserCourse);

module.exports = router;
