import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Teacher',
    required: true,
  },
  level: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['video', 'pdf'],
    required: true,
  },
  videoLink: {
    type: String,
    required: function() {
      return this.type === 'video';
    },
  },
  pdfFileName: {
    type: String,
    required: function() {
      return this.type === 'pdf';
    },
  },
  pdfPath: {
    type: String,
    required: false,
  },
  students: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
  }],
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5,
  },
  downloads: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

courseSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Course = mongoose.model('Course', courseSchema);

export default Course;