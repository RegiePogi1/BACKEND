const pool = require('../config/database');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const register = async (req, res) => {
  const { fullname, username, password } = req.body;

  try {
    // Hash the password before inserting
    const hashedPassword = await bcrypt.hash(password, 10);

    // Start a transaction to ensure atomic operations
    await pool.query('START TRANSACTION');

    // Insert user into the database
    const [userResult] = await pool.query(
      'INSERT INTO users (fullname, username, password) VALUES (?, ?, ?)', 
      [fullname, username, hashedPassword]
    );

    // Get the newly inserted user's ID
    const user_id = userResult.insertId;

    await pool.query('COMMIT');

    res.status(201).json({ message: 'User registered successfully!', user_id });
  } catch (err) {
    // Rollback the transaction in case of any error
    await pool.query('ROLLBACK');
    res.status(500).json({ error: err.message });
  }
};

// Login function
const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Query the user based on username
    const [rows] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);

    if (rows.length === 0) {
      return res.status(400).json({ error: 'Invalid credentials!' });
    }

    const user = rows[0];

    // Compare hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials!' });
    }

    // Generate a token (JWT)
    const token = jwt.sign(
      {
        user_id: user.user_id,
        username: user.username,
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_ACCESS_EXPIRATION_TIME || '1h' }
    );

    // Send back the token
    res.json({ token });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { register, login };
