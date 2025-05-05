import { Title } from '#components';

const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    title: String,
    description: String,
    images: String,
    video: String,
    pdf: String,
});

module.exports = mongoose.model('Course', courseSchema);