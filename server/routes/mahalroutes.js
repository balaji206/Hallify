const express = require('express');
const router = express.Router();
const upload = require('../middelware/uploadmiddleware'); // Ensure correct path
const verifyToken = require('../middelware/verifytoken'); // Auth middleware

const {
  addMahal,
  getMahals,
  updateMahal,
  deleteMahal,
  getMahalsbyId
} = require('../controllers/mahalcontroller');

// 🔓 Public - Anyone can fetch mahals
router.get('/get', getMahals);

// Get details of a mahal by its ID
router.get('/get/:id', getMahalsbyId);

// 🔒 Admin and Owner can add mahals (with image upload)
router.post('/add', verifyToken(['admin', 'owner']), upload.single('image'), addMahal);

// 🔒 Admin and Owner can update mahals (with image upload)
router.put('/update/:id', verifyToken(['admin', 'owner']), upload.single('image'), updateMahal);

// 🔒 Admin and Owner can delete mahals
router.delete('/delete/:id', verifyToken(['admin', 'owner']), deleteMahal);

module.exports = router;
