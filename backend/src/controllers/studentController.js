import Student from '../models/student.js';
import Course from '../models/course.js';
import LiveRequest from '../models/liveRequest.js';

export const createStudent = async (req, res) => {
  try {
    const student = new Student(req.body);
    await student.save();
    res.status(201).json(student);
  } catch (error) {
    res.status(400).json({ message: 'Error creating student', error: error.message });
  }
};

export const updateStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.json(student);
  } catch (error) {
    res.status(400).json({ message: 'Error updating student', error: error.message });
  }
};

export const getStudentById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id).populate('courses');
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.json(student);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving student', error: error.message });
  }
};

export const getAllStudents = async (req, res) => {
  try {
    const students = await Student.find().populate('courses');
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving students', error: error.message });
  }
};

export const deleteStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.json({ message: 'Student deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting student', error: error.message });
  }
};

export const getStudentCourses = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id).populate('courses');
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.json(student.courses);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving student courses', error: error.message });
  }
};

export const getStudentLiveRequests = async (req, res) => {
  try {
    const liveRequests = await LiveRequest.find({ student: req.params.id })
      .populate('acceptedBy', 'name subject')
      .sort({ createdAt: -1 });
    res.json(liveRequests);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving live requests', error: error.message });
  }
};