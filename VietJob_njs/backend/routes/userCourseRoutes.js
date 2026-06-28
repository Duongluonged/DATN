const express = require('express');
const router = express.Router();
const { 
    getUserCourses, 
    addUserCourse, 
    removeUserCourse, 
    enrollUserCourse 
} = require('../controllers/userCourseController');

router.get('/:userId', getUserCourses);

router.post('/add', addUserCourse);

router.post('/remove', removeUserCourse);

router.post('/enroll', enrollUserCourse);

module.exports = router;
