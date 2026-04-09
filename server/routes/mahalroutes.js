const express = require('express');
const router = express.Router();
const upload = require('../middelware/uploadmiddleware'); // Ensure correct path
const verifyToken = require('../middelware/verifytoken'); // Auth middleware

const {
  addMahal,
  getMahals,
  updateMahal,
  deleteMahal,
  getMahalsbyId,
  getOwnerMahals
} = require('../controllers/mahalcontroller');

router.get('/get', getMahals);

router.get('/owner', getOwnerMahals);

router.get('/get/:id', getMahalsbyId);

router.post('/add', verifyToken(['admin', 'owner']), upload.single('image'), addMahal);

router.put('/update/:id', verifyToken(['admin', 'owner']), upload.single('image'), updateMahal);

router.delete('/delete/:id', verifyToken(['admin', 'owner']), deleteMahal);

module.exports = router;
