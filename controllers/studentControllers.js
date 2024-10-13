const pool = require('../config/database');

// Get all students
const getAllStudents = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM students');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get student by ID
const getStudentById = async (req, res) => {
    const { id } = req.params;
    try {
        const [rows] = await pool.query('SELECT * FROM students WHERE student_id = ?', [id]);

        if (rows.length === 0) {
            return res.status(404).json({ error: `Student with ID: ${id} not found` });
        }

        res.json(rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Create student
const createStudent = async (req, res) => {
    const { lname, fname, mname, user_id, course_id } = req.body;

    try {
        const [result] = await pool.query('INSERT INTO students (lname, fname, mname, user_id, course_id) VALUES (?, ?, ?, ?, ?)', 
                                          [lname, fname, mname, user_id, course_id]);
        res.status(201).json({ id: result.insertId, lname, fname, mname, user_id, course_id });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Update student
const updateStudent = async (req, res) => {
    const { id } = req.params;
    const { lname, fname, mname, user_id, course_id } = req.body;

    try {
        const [result] = await pool.query('UPDATE students SET lname = ?, fname = ?, mname = ?, user_id = ?, course_id = ? WHERE student_id = ?', 
                                          [lname, fname, mname, user_id, course_id, id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: `Student with ID: ${id} not found` });
        }

        res.json({ message: `Student with ID: ${id} was updated successfully` });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Delete student
const deleteStudent = async (req, res) => {
    const { id } = req.params;

    try {
        const [result] = await pool.query('DELETE FROM students WHERE student_id = ?', [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: `Student with ID: ${id} not found` });
        }

        res.json({ message: `Student with ID: ${id} was deleted successfully` });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = { getAllStudents, getStudentById, createStudent, updateStudent, deleteStudent };
