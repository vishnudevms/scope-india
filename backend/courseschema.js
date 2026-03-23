const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
  title: String,
  subCourses: [String]
});
module.exports = mongoose.model('Course', CourseSchema);