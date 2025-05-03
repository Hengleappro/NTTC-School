const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  lessons: [String],
}, { timestamps: true });

module.exports = mongoose.model('Course', CourseSchema);
