const db = require('../db');

const createBookingsTable = `
CREATE TABLE IF NOT EXISTS bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    mahal_id INT NOT NULL,
    user_id INT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    total_price INT NOT NULL,
    status ENUM('pending', 'confirmed', 'cancelled') DEFAULT 'confirmed',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (mahal_id) REFERENCES mahals(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
`;

db.query(createBookingsTable, (err) => {
    if (err) {
        console.error('❌ Error creating bookings table:', err);
        process.exit(1);
    } else {
        console.log('✅ Bookings table ready');
        process.exit(0);
    }
});
