const pool = require('../config/database');

// Get all courses
const getAllCourses = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM courses');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get course by ID
const getCourseById = async (req, res) => {
    const { id } = req.params;
    try {
        const [rows] = await pool.query('SELECT * FROM courses WHERE course_id = ?', [id]);

        if (rows.length === 0) {
            return res.status(404).json({ error: `Course with ID: ${id} not found` });
        }

        res.json(rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Create course
const createCourse = async (req, res) => {
    const { course_code, course_name, user_id, dept_id } = req.body;

    try {
        const [result] = await pool.query('INSERT INTO courses (course_code, course_name, user_id, dept_id) VALUES (?, ?, ?, ?)', 
                                          [course_code, course_name, user_id, dept_id]);
        res.status(201).json({ id: result.insertId, course_code, course_name, user_id, dept_id });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Update course
const updateCourse = async (req, res) => {
    const { id } = req.params;
    const { course_code, course_name, user_id, dept_id } = req.body;

    try {
        const [result] = await pool.query('UPDATE courses SET course_code = ?, course_name = ?, user_id = ?, dept_id = ? WHERE course_id = ?', 
                                          [course_code, course_name, user_id, dept_id, id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: `Course with ID: ${id} not found` });
        }

        res.json({ message: `Course with ID: ${id} was updated successfully` });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Delete course
const deleteCourse = async (req, res) => {
    const { id } = req.params;

    try {
        const [result] = await pool.query('DELETE FROM courses WHERE course_id = ?', [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: `Course with ID: ${id} not found` });
        }

        res.json({ message: `Course with ID: ${id} was deleted successfully` });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = { getAllCourses, getCourseById, createCourse, updateCourse, deleteCourse };
