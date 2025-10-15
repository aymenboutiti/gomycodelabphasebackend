import LiveRequest from '../models/liveRequest.js';
import Student from '../models/student.js';
import Teacher from '../models/teacher.js';

export const createLiveRequest = async (req, res) => {
  try {
    const { subject, theme, type, date, delay } = req.body;
    const studentId = req.user.id; // Assuming user is authenticated

    const liveRequest = new LiveRequest({
      student: studentId,
      subject,
      theme,
      type,
      date: date ? new Date(date) : null,
      delay
    });

    await liveRequest.save();
    await liveRequest.populate('student', 'name email level classe');

    res.status(201).json(liveRequest);
  } catch (error) {
    res.status(400).json({ message: 'Error creating live request', error: error.message });
  }
};

export const getAllLiveRequests = async (req, res) => {
  try {
    const liveRequests = await LiveRequest.find()
      .populate('student', 'name email level classe')
      .populate('acceptedBy', 'name subject')
      .sort({ createdAt: -1 });
    res.json(liveRequests);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving live requests', error: error.message });
  }
};

export const getLiveRequestById = async (req, res) => {
  try {
    const liveRequest = await LiveRequest.findById(req.params.id)
      .populate('student', 'name email level classe')
      .populate('acceptedBy', 'name subject');
    
    if (!liveRequest) {
      return res.status(404).json({ message: 'Live request not found' });
    }
    
    res.json(liveRequest);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving live request', error: error.message });
  }
};

export const updateLiveRequest = async (req, res) => {
  try {
    const liveRequest = await LiveRequest.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).populate('student', 'name email level classe')
     .populate('acceptedBy', 'name subject');

    if (!liveRequest) {
      return res.status(404).json({ message: 'Live request not found' });
    }

    res.json(liveRequest);
  } catch (error) {
    res.status(400).json({ message: 'Error updating live request', error: error.message });
  }
};

export const deleteLiveRequest = async (req, res) => {
  try {
    const liveRequest = await LiveRequest.findByIdAndDelete(req.params.id);
    if (!liveRequest) {
      return res.status(404).json({ message: 'Live request not found' });
    }
    res.json({ message: 'Live request deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting live request', error: error.message });
  }
};

export const acceptLiveRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const { teacherResponse } = req.body;
    const teacherId = req.user.id;

    const liveRequest = await LiveRequest.findByIdAndUpdate(
      requestId,
      {
        status: 'accepted',
        teacherResponse,
        acceptedBy: teacherId
      },
      { new: true }
    ).populate('student', 'name email level classe')
     .populate('acceptedBy', 'name subject');

    if (!liveRequest) {
      return res.status(404).json({ message: 'Live request not found' });
    }

    res.json(liveRequest);
  } catch (error) {
    res.status(500).json({ message: 'Error accepting live request', error: error.message });
  }
};

export const rejectLiveRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const { teacherResponse } = req.body;

    const liveRequest = await LiveRequest.findByIdAndUpdate(
      requestId,
      {
        status: 'rejected',
        teacherResponse
      },
      { new: true }
    ).populate('student', 'name email level classe');

    if (!liveRequest) {
      return res.status(404).json({ message: 'Live request not found' });
    }

    res.json(liveRequest);
  } catch (error) {
    res.status(500).json({ message: 'Error rejecting live request', error: error.message });
  }
};

export const getLiveRequestsByStudent = async (req, res) => {
  try {
    const liveRequests = await LiveRequest.find({ student: req.params.studentId })
      .populate('acceptedBy', 'name subject')
      .sort({ createdAt: -1 });
    res.json(liveRequests);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving student live requests', error: error.message });
  }
};

export const getPendingLiveRequests = async (req, res) => {
  try {
    const liveRequests = await LiveRequest.find({ status: 'pending' })
      .populate('student', 'name email level classe')
      .sort({ createdAt: -1 });
    res.json(liveRequests);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving pending live requests', error: error.message });
  }
};
