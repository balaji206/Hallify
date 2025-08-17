const db = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { getUserFromHeader } = require('../middelware/authmiddleware');

exports.registeruser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const salt = await bcrypt.genSalt(10);
    const hashedpassword = await bcrypt.hash(password, salt);

    const query = `INSERT INTO users(name,email,password,role) VALUES(?,?,?,?)`;
    db.query(query, [name, email, hashedpassword, role], (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ message: "User registered successfully" });
    });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
};

exports.loginuser = (req, res) => {
  let { email, password, role } = req.body;

  if (!email || !password || !role) {
    return res.status(400).json({ message: "Email, password, and role are required" });
  }

  role = role.toLowerCase();

  db.query(`SELECT * FROM users WHERE email = ? AND role = ?`, [email, role], async (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.length === 0) return res.status(404).json({ message: "User not found" });

    const user = result[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.status(200).json({
      message: "Login Success",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  });
};



exports.getuser = (req, res) => {
  let user;
  try {
    user = getUserFromHeader(req);  // May throw if token missing/invalid
  } catch (err) {
    return res.status(401).json({ message: "Unauthorized: Invalid or missing token" });
  }

  const { id: userId, role } = user;

  const query = `SELECT * FROM users WHERE id = ?`;
  db.query(query, [userId], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.length === 0) return res.status(404).json({ message: "User not found" });
    res.status(200).json(result[0]);
  });
};


exports.updateuser = async (req, res) => {
  try {
    const { id: userId, role } = getUserFromHeader(req);
    const toupdate = parseInt(req.params.id);

    if (role !== 'admin' && userId !== toupdate) {
      return res.status(403).json({ message: "You are not authorized to update this user" });
    }

    const { name, email, password, role: newRole } = req.body;

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    db.query(`UPDATE users SET name=?, email=?, password=?, role=? WHERE id = ?`,
      [name, email, hashedPassword, newRole, toupdate], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(200).json({ message: "User updated successfully" });
      });

  } catch (err) {
    res.status(500).send({ error: err.message });
  }
};

exports.deleteuser = (req, res) => {
  try {
    const requestId = parseInt(req.headers['x-user-id']);
    const targetId = parseInt(req.params.id);

    if (!requestId) {
      return res.status(400).json({ message: "User ID header is missing" });
    }

    db.query(`SELECT * FROM users WHERE id = ?`, [requestId], (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      if (result.length === 0) return res.status(404).json({ message: "User not found" });

      const requester = result[0];

      if (requester.role === 'admin' && requestId !== targetId) {
        db.query(`DELETE FROM users WHERE id = ?`, [targetId], (err) => {
          if (err) return res.status(500).json({ error: err.message });
          res.status(200).json({ message: "User deleted successfully" });
        });
      } else {
        res.status(403).json({ message: "You are not authorized to delete this user" });
      }
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
