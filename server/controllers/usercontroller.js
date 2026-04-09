const db = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { getUserFromHeader } = require('../middelware/authmiddleware');

exports.registeruser = async (req, res) => {
  try {
    const { fullName, email, password, role } = req.body;

    console.log("BODY:", req.body);

    const salt = await bcrypt.genSalt(10);
    const hashedpassword = await bcrypt.hash(password, salt);

    const query = `
      INSERT INTO users("fullName",email,password,role)
      VALUES($1, $2, $3, $4)
    `;

    db.query(query, [fullName, email, hashedpassword, role], (err) => {
      if (err) {
        console.error("REGISTER ERROR:", err);
        return res.status(500).json({ error: err.message });
      }
      res.status(201).json({ message: "User registered successfully" });
    });

  } catch (err) {
    console.error("CATCH ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};
exports.loginuser = (req, res) => {
  let { email, password, role } = req.body;

  if (!email || !password || !role) {
    return res.status(400).json({ message: "Email, password, and role are required" });
  }

  role = role.toLowerCase();

  db.query(`SELECT * FROM users WHERE email = $1 AND role = $2`, [email, role], async (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.rows.length === 0) return res.status(404).json({ message: "User not found" });

    const user = result.rows[0];
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
        fullName: user.fullName,
        email: user.email,
        role: user.role
      }
    });
  });
};



exports.getuser = (req, res) => {
  let user;
  try {
    user = getUserFromHeader(req);
  } catch (err) {
    console.error("Auth Error:", err);
    return res.status(401).json({ 
      message: "Unauthorized: Invalid or missing token",
      details: err.message || err
    });
  }

  const { id: userId } = user;

  const query = `SELECT * FROM users WHERE id = $1`;
  db.query(query, [userId], (err, result) => {
    if (err) {
      console.error("DB Error in getuser:", err);
      return res.status(500).json({ 
        error: err.message || "Unknown DB error",
        details: err
      });
    }
    if (result.rows.length === 0) return res.status(404).json({ message: "User not found" });
    res.status(200).json(result.rows[0]);
  });
};



exports.updateuser = async (req, res) => {
  try {
    const { id: userId, role } = getUserFromHeader(req);
    const toupdate = parseInt(req.params.id);

    if (role !== 'admin' && userId !== toupdate) {
      return res.status(403).json({ message: "You are not authorized to update this user" });
    }

    const { fullName, email, password, role: newRole } = req.body;

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    db.query(`UPDATE users SET "fullName"=$1, email=$2, password=$3, role=$4 WHERE id = $5`,
      [fullName, email, hashedPassword, newRole, toupdate], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(200).json({ message: "User updated successfully" });
      });

  } catch (err) {
    res.status(500).send({ error: err.message });
  }
};

exports.deleteuser = (req, res) => {
  try {
    const { id: requestId, role: requesterRole } = getUserFromHeader(req);
    const targetId = parseInt(req.params.id);

    if (requesterRole !== 'admin') {
      return res.status(403).json({ message: "Admin access required" });
    }

    if (requestId === targetId) {
        return res.status(400).json({ message: "Admins cannot delete their own account from the dashboard" });
    }

    db.query(`DELETE FROM users WHERE id = $1`, [targetId], (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(200).json({ message: "User deleted successfully" });
    });
  } catch (err) {
    res.status(401).json({ error: "Unauthorized" });
  }
};

/**
 * Admin: Get all users
 */
exports.getUsers = (req, res) => {
    const { role } = getUserFromHeader(req);
    if (role !== 'admin') {
        return res.status(403).json({ message: "Admin access required" });
    }

    db.query('SELECT id, "fullName", email, role, created_at FROM users ORDER BY created_at DESC', (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(200).json(result.rows);
    });
};

/**
 * Admin: Update user role
 */
exports.updateUserRole = (req, res) => {
    try {
        const { role } = getUserFromHeader(req);
        if (role !== 'admin') {
            return res.status(403).json({ message: "Admin access required" });
        }

        const targetId = req.params.id;
        const { role: newRole } = req.body;

        if (!['user', 'owner', 'admin'].includes(newRole)) {
            return res.status(400).json({ message: "Invalid role. Role must be user, owner, or admin." });
        }

        db.query('UPDATE users SET role = $1 WHERE id = $2', [newRole, targetId], (err) => {
            if (err) return res.status(500).json({ error: err.message });
            res.status(200).json({ message: `User role successfully updated to ${newRole}` });
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
