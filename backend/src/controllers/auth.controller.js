import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import db from '../db/database.js';

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key-for-hackathon';

export const signup = async (req, res) => {
  try {
    const { name, email, password, role, designation, unit } = req.body;
    
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, error: 'Name, email and password are required.' });
    }

    const existingUser = db.prepare('SELECT * FROM users WHERE email = ?').get(email.toLowerCase());
    if (existingUser) {
      return res.status(400).json({ success: false, error: 'Email already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const id = `usr-${Date.now()}`;
    const clearanceLevel = role === 'national_admin' ? 'TOP SECRET' : role === 'state_officer' ? 'CONFIDENTIAL' : 'INTERNAL';
    const avatar = name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

    db.prepare(`
      INSERT INTO users (id, name, email, password, role, designation, unit, clearanceLevel, avatar)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(id, name, email.toLowerCase(), hashedPassword, role || 'state_officer', designation || 'Field Officer', unit || 'Unassigned', clearanceLevel, avatar);

    const user = { id, name, email, role, designation, unit, clearanceLevel, avatar };
    const token = jwt.sign({ id }, JWT_SECRET, { expiresIn: '24h' });

    res.status(201).json({ success: true, user, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Internal server error during signup.' });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Email and password required.' });
    }

    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email.toLowerCase());
    if (!user) {
      return res.status(401).json({ success: false, error: 'Invalid credentials.' });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ success: false, error: 'Invalid credentials.' });
    }

    const { password: _, ...safeUser } = user;
    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '24h' });

    res.json({ success: true, user: safeUser, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Internal server error during login.' });
  }
};

export const getProfile = (req, res) => {
  try {
    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.user.id);
    if (!user) return res.status(404).json({ success: false, error: 'User not found.' });

    const { password: _, ...safeUser } = user;
    res.json({ success: true, user: safeUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Failed to fetch profile.' });
  }
};

export const updateProfile = (req, res) => {
  try {
    const { name, designation, unit } = req.body;
    const userId = req.user.id;

    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(userId);
    if (!user) return res.status(404).json({ success: false, error: 'User not found.' });

    const avatar = name ? name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : user.avatar;

    db.prepare(`
      UPDATE users 
      SET name = COALESCE(?, name),
          designation = COALESCE(?, designation),
          unit = COALESCE(?, unit),
          avatar = ?
      WHERE id = ?
    `).run(name, designation, unit, avatar, userId);

    const updatedUser = db.prepare('SELECT * FROM users WHERE id = ?').get(userId);
    const { password: _, ...safeUser } = updatedUser;

    res.json({ success: true, user: safeUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Failed to update profile.' });
  }
};
