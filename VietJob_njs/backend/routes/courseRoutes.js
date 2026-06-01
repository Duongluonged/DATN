const express = require('express');
const router = express.Router();
const {
    getCoursesByEmployer,
    createCourse,
    updateCourse,
    deleteCourse
} = require('../controllers/courseController');

// Lấy danh sách: GET /api/courses/employer/:userId?trangThai=Nháp
router.get('/employer/:userId', getCoursesByEmployer);

// Tạo mới: POST /api/courses/employer/:userId
router.post('/employer/:userId', createCourse);

// Cập nhật: PUT /api/courses/:courseId?userId=...
router.put('/:courseId', updateCourse);

// Xóa mềm: DELETE /api/courses/:courseId?userId=...
router.delete('/:courseId', deleteCourse);

module.exports = router;
