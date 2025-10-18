// File: /backend/src/controllers/authController.js

import User from '../models/user.js';
import Student from '../models/student.js';
import Teacher from '../models/teacher.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const register = async (req, res) => {
    const { nom, prenom, email, telephone, ville, password, role, level, classe, matiere } = req.body;

    try {
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists with this email' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Create user record
        const newUser = new User({ 
            username: email, 
            password: hashedPassword, 
            email,
            role: role === 'eleve' ? 'student' : 'teacher'
        });
        await newUser.save();

        // Create role-specific record
        if (role === 'eleve') {
            const newStudent = new Student({
                name: `${prenom} ${nom}`,
                email,
                password: hashedPassword,
                level,
                classe,
                ville,
                telephone
            });
            await newStudent.save();
        } else {
            const newTeacher = new Teacher({
                name: `${prenom} ${nom}`,
                email,
                subject: matiere,
                phone: telephone,
                ville
            });
            await newTeacher.save();
        }

        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '24h' });
        
        res.status(201).json({ 
            message: 'User registered successfully',
            token,
            user: {
                id: newUser._id,
                email: newUser.email,
                role: newUser.role,
                name: `${prenom} ${nom}`
            }
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Error registering user', error: error.message });
    }
};

export const login = async (req, res) => {
    const { email, password, role } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if role matches
        const expectedRole = role === 'eleve' ? 'student' : 'teacher';
        if (user.role !== expectedRole) {
            return res.status(401).json({ message: 'Invalid role for this account' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '24h' });
        
        res.status(200).json({ 
            token,
            user: {
                id: user._id,
                email: user.email,
                role: user.role,
                username: user.username
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Error logging in', error: error.message });
    }
};

export const getProfile = async (req, res) => {
    try {
        const user = req.user;
        
        if (user.role === 'student') {
            const student = await Student.findOne({ email: user.email });
            res.json({ user, profile: student });
        } else {
            const teacher = await Teacher.findOne({ email: user.email });
            res.json({ user, profile: teacher });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error fetching profile', error: error.message });
    }
};