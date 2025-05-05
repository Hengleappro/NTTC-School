const express = require('express');
const router = express.Router();
const Course = require('../models/Course');
const multer = require('multer');
const path = require('path');
const auth = require('../middleware/authMiddleware')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, Date.now() + '-' + file.originalname);
    },
});

const upload = multer({ storage: storage });

router.get('/', async (req, res) => {
    const courses = await Course.find();
    res.json(courses);
});

router.post('/', upload.fields([
    {name: 'image'},
    {name: 'video'},
    {name: 'pdf'}
]), async (req, res) => {
    const { title, description } = req.body;
    const newCourse = new Course({
        title,
        description,
        images: req.files['image'][0].filename || '',
        video: req.files['video'][0].filename || '',
        pdf: req.files['pdf'][0].filename || '',
    });

    await newCourse.save();
    res.json({ message: 'Course created successfully' });
});

router.post('/', auth, upload.fields([
    {name: 'image'},
    {name: 'video'},
    {name: 'pdf'}
]), async (req, res) => {
    const { title, description } = req.body;
    const newCourse = new Course({
        title,
        description,
        images: req.files['image'][0].filename || '',
        video: req.files['video'][0].filename || '',
        pdf: req.files['pdf'][0].filename || '',
    });

    await newCourse.save();
    res.json({ message: 'Course created successfully' });
  });

module.exports = router;