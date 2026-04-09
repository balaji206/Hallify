const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const Path = require('path')
const mahalRoutes = require('./routes/mahalroutes');
const userRoutes = require('./routes/userroutes');
const bookingRoutes = require('./routes/bookingroutes'); // ✅ Add this

app.use(express.json());
app.use(cors());

app.use('/api/mahal', mahalRoutes);
app.use('/api/users', userRoutes);
app.use('/api/booking', bookingRoutes); // ✅ Booking routes added

app.use('/uploads',express.static(Path.join(__dirname,'uploads')));

app.get('/', (req, res) => res.send('Hello World 🌍'));


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
