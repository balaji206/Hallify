const express = require('express');
const router = express.Router();
const { createBooking, getMahalBookings, getUserBookings, getOwnerBookings, getAllBookings } = require('../controllers/bookingcontroller');

router.post('/create', createBooking);
router.get('/mahal/:id', getMahalBookings);
router.get('/user', getUserBookings);
router.get('/owner', getOwnerBookings);
router.get('/all', getAllBookings);

module.exports = router;
