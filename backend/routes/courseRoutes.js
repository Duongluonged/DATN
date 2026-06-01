const express = require('express');
const router = express.Router();
const {
    getCoursesByEmployer,
    createCourse,
    updateCourse,
    deleteCourse,
    getAllCourses,
    updateCourseStatus
} = require('../controllers/courseController');

// Lấy toàn bộ danh sách khóa học cho Admin
router.get('/', getAllCourses);

// Admin duyệt/cập nhật trạng thái khóa học
router.put('/:courseId/status', updateCourseStatus);

// Lấy danh sách: GET /api/courses/employer/:userId?trangThai=Nháp
router.get('/employer/:userId', getCoursesByEmployer);

// Tạo mới: POST /api/courses/employer/:userId
router.post('/employer/:userId', createCourse);

// Cập nhật: PUT /api/courses/:courseId?userId=...
router.put('/:courseId', updateCourse);

// Xóa mềm: DELETE /api/courses/:courseId?userId=...
router.delete('/:courseId', deleteCourse);

module.exports = router;
