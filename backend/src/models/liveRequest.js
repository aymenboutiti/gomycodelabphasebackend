import mongoose from 'mongoose';

const liveRequestSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true,
  },
  subject: {
    type: String,
    required: true,
  },
  theme: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['course_resume', 'emphasize_exercise', 'exam_review'],
    required: true,
  },
  date: {
    type: Date,
    required: false,
  },
  delay: {
    type: String,
    required: false,
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected', 'completed'],
    default: 'pending',
  },
  teacherResponse: {
    type: String,
    required: false,
  },
  acceptedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Teacher',
    required: false,
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

liveRequestSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const LiveRequest = mongoose.model('LiveRequest', liveRequestSchema);

export default LiveRequest;
