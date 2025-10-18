import Teacher from '../models/teacher.js';
import Course from '../models/course.js';
import LiveRequest from '../models/liveRequest.js';

export const createTeacher = async (req, res) => {
  try {
    const teacher = new Teacher(req.body);
    await teacher.save();
    res.status(201).json(teacher);
  } catch (error) {
    res.status(400).json({ message: 'Error creating teacher', error: error.message });
  }
};

export const updateTeacher = async (req, res) => {
  try {
    const teacher = await Teacher.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }
    res.json(teacher);
  } catch (error) {
    res.status(400).json({ message: 'Error updating teacher', error: error.message });
  }
};

export const getTeacherById = async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id).populate('courses');
    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }
    res.json(teacher);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving teacher', error: error.message });
  }
};

export const getAllTeachers = async (req, res) => {
  try {
    const teachers = await Teacher.find().populate('courses');
    res.json(teachers);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving teachers', error: error.message });
  }
};

export const deleteTeacher = async (req, res) => {
  try {
    const teacher = await Teacher.findByIdAndDelete(req.params.id);
    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }
    res.json({ message: 'Teacher deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting teacher', error: error.message });
  }
};

export const getTeacherCourses = async (req, res) => {
  try {
    const teacherId = req.params.id;
    const courses = await Course.find({ teacher: teacherId });
    res.json(courses);
  } catch (error) {
    console.error('Error retrieving teacher courses:', error);
    res.status(500).json({ message: 'Error retrieving teacher courses', error: error.message });
  }
};

export const getLiveRequestsForTeacher = async (req, res) => {
  try {
    const liveRequests = await LiveRequest.find({ status: 'pending' })
      .populate('student', 'name email level classe')
      .sort({ createdAt: -1 });
    res.json(liveRequests);
  } catch (error) {
    console.error('Error retrieving live requests:', error);
    res.status(500).json({ message: 'Error retrieving live requests', error: error.message });
  }
};

export const acceptLiveRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const { teacherResponse } = req.body;
    
    const liveRequest = await LiveRequest.findByIdAndUpdate(
      requestId,
      {
        status: 'accepted',
        teacherResponse,
        acceptedBy: req.user.id
      },
      { new: true }
    ).populate('student', 'name email');

    if (!liveRequest) {
      return res.status(404).json({ message: 'Live request not found' });
    }

    res.json(liveRequest);
  } catch (error) {
    res.status(500).json({ message: 'Error accepting live request', error: error.message });
  }
};