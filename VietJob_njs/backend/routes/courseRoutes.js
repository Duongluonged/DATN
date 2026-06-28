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

router.get('/', getAllCourses);

router.put('/:courseId/status', updateCourseStatus);

router.get('/employer/:userId', getCoursesByEmployer);

router.post('/employer/:userId', createCourse);

router.put('/:courseId', updateCourse);

router.delete('/:courseId', deleteCourse);

module.exports = router;
