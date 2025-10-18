import Course from '../models/course.js';
import Teacher from '../models/teacher.js';
import Student from '../models/student.js';
import multer from 'multer';
import path from 'path';

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

export const upload = multer({ storage });

export const createCourse = async (req, res) => {
  try {
    const { title, description, level, type, videoLink, teacher } = req.body;
    
    console.log('Course creation request:', { title, description, level, type, videoLink, teacher });
    console.log('File uploaded:', req.file);
    console.log('Request body:', req.body);
    
    // Validate required fields
    if (!title || !level || !type || !teacher) {
      return res.status(400).json({ 
        message: 'Missing required fields', 
        required: ['title', 'level', 'type', 'teacher'],
        received: { title, level, type, teacher }
      });
    }
    
    const courseData = {
      title,
      description,
      level,
      type,
      teacher
    };

    if (type === 'video') {
      courseData.videoLink = videoLink;
    } else if (type === 'pdf' && req.file) {
      courseData.pdfFileName = req.file.originalname;
      courseData.pdfPath = req.file.path;
    }

    console.log('Creating course with data:', courseData);
    
    const course = new Course(courseData);
    console.log('Course object created:', course);
    
    await course.save();
    console.log('Course saved to database:', course);

    // Add course to teacher's courses
    await Teacher.findByIdAndUpdate(teacher, {
      $push: { courses: course._id }
    });
    console.log('Course added to teacher profile');

    console.log('Course created successfully:', course);
    res.status(201).json(course);
  } catch (error) {
    console.error('Error creating course:', error);
    res.status(400).json({ message: 'Error creating course', error: error.message });
  }
};

export const updateCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    res.json(course);
  } catch (error) {
    res.status(400).json({ message: 'Error updating course', error: error.message });
  }
};

export const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('teacher', 'name subject')
      .populate('students', 'name email');
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    res.json(course);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving course', error: error.message });
  }
};

export const getAllCourses = async (req, res) => {
  try {
    const { level, type, teacher } = req.query;
    const filter = {};
    
    if (level) filter.level = level;
    if (type) filter.type = type;
    if (teacher) filter.teacher = teacher;

    const courses = await Course.find(filter)
      .populate('teacher', 'name subject')
      .populate('students', 'name email')
      .sort({ createdAt: -1 });
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving courses', error: error.message });
  }
};

export const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    res.json({ message: 'Course deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting course', error: error.message });
  }
};

export const enrollStudent = async (req, res) => {
  try {
    const { courseId, studentId } = req.params;
    
    const course = await Course.findByIdAndUpdate(
      courseId,
      { $addToSet: { students: studentId } },
      { new: true }
    );

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Add course to student's courses
    await Student.findByIdAndUpdate(studentId, {
      $addToSet: { courses: courseId }
    });

    res.json({ message: 'Student enrolled successfully', course });
  } catch (error) {
    res.status(500).json({ message: 'Error enrolling student', error: error.message });
  }
};

export const rateCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { rating } = req.body;

    const course = await Course.findByIdAndUpdate(
      courseId,
      { rating },
      { new: true }
    );

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    res.json({ message: 'Course rated successfully', course });
  } catch (error) {
    res.status(500).json({ message: 'Error rating course', error: error.message });
  }
};