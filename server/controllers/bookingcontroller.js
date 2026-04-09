const db = require('../db');
const transporter = require('../config/mailer');
const { getUserFromHeader } = require('../middelware/authmiddleware');

/**
 * Handle new booking creation
 */
exports.createBooking = async (req, res) => {
    try {
        const { id: userId } = getUserFromHeader(req);
        const { mahalId, startDate, endDate, totalPrice } = req.body;

        if (!mahalId || !startDate || !endDate || !totalPrice) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // 1. Check for overlapping bookings
        const overlapQuery = `
            SELECT * FROM bookings 
            WHERE mahal_id = $1 
            AND status = 'confirmed'
            AND (
                (start_date <= $2 AND end_date >= $3) OR
                (start_date <= $4 AND end_date >= $5) OR
                (start_date >= $6 AND end_date <= $7)
            )
        `;

        db.query(overlapQuery, [mahalId, startDate, startDate, endDate, endDate, startDate, endDate], (err, results) => {
            if (err) return res.status(500).json({ error: err.message });
            if (results.rows.length > 0) {
                return res.status(400).json({ message: "Selected dates are already booked." });
            }

            // 1.5. Check if the user is the owner of the mahal
            db.query('SELECT owner_id FROM mahals WHERE id = $1', [mahalId], (err, mahalResult) => {
                if (err) return res.status(500).json({ error: err.message });
                if (mahalResult.rows.length === 0) return res.status(404).json({ message: "Mahal not found" });

                if (mahalResult.rows[0].owner_id === userId) {
                    return res.status(403).json({ message: "Owners/Admins cannot book their own venues. Please use your owner portal to manage your dates." });
                }

                // 2. Insert Booking
                const insertQuery = `
                    INSERT INTO bookings (mahal_id, user_id, start_date, end_date, total_price, status)
                    VALUES ($1, $2, $3, $4, $5, 'confirmed')
                `;

                db.query(insertQuery, [mahalId, userId, startDate, endDate, totalPrice], (err, bookingResult) => {
                    if (err) return res.status(500).json({ error: err.message });

                // 3. Fetch details for email (User, Owner, Mahal)
                const infoQuery = `
                    SELECT 
                        u.email as user_email, u."fullName" as user_name,
                        o.email as owner_email, o."fullName" as owner_name,
                        m.name as mahal_name, m.location as mahal_location
                    FROM users u
                    JOIN mahals m ON m.id = $1
                    JOIN users o ON o.id = m.owner_id
                    WHERE u.id = $2
                `;

                db.query(infoQuery, [mahalId, userId], async (err, infoResult) => {
                    if (err || infoResult.rows.length === 0) {
                        console.error("Failed to fetch email info:", err);
                        return res.status(201).json({ message: "Booking confirmed, but failed to send notifications." });
                    }

                    const info = infoResult.rows[0];

                    // 4. Send Emails
                    try {
                        // Email to User
                        await transporter.sendMail({
                            from: `"${process.env.APP_NAME || 'Hallify'}" <${process.env.EMAIL_USER}>`,
                            to: info.user_email,
                            subject: `Booking Confirmed: ${info.mahal_name}`,
                            html: `
                                <div style="font-family: serif; color: #1a0f0a; padding: 20px; border: 2px solid #D4AF37; border-radius: 10px;">
                                    <h1 style="color: #D4AF37; text-align: center;">Reservation Confirmed</h1>
                                    <p>Dear <strong>${info.user_name}</strong>,</p>
                                    <p>Your booking for <strong>${info.mahal_name}</strong> has been successfully confirmed.</p>
                                    <div style="background: #fdfbf7; padding: 15px; border-radius: 8px; margin: 20px 0;">
                                        <p><strong>Venue:</strong> ${info.mahal_name}</p>
                                        <p><strong>Location:</strong> ${info.mahal_location}</p>
                                        <p><strong>Duration:</strong> ${startDate} to ${endDate}</p>
                                        <p><strong>Total Price:</strong> ₹${totalPrice}</p>
                                    </div>
                                    <p>We look forward to hosting your grand event!</p>
                                    <p style="margin-top: 30px; font-size: 12px; color: #8a6a2f;">© ${new Date().getFullYear()} Hallify - Curating Grandeur</p>
                                </div>
                            `
                        });

                        // Email to Owner
                        await transporter.sendMail({
                            from: `"${process.env.APP_NAME || 'Hallify'}" <${process.env.EMAIL_USER}>`,
                            to: info.owner_email,
                            subject: `New Reservation for ${info.mahal_name}`,
                            html: `
                                <div style="font-family: serif; color: #1a0f0a; padding: 20px; border: 2px solid #D4AF37; border-radius: 10px;">
                                    <h1 style="color: #D4AF37; text-align: center;">New Booking Received</h1>
                                    <p>Dear <strong>${info.owner_name}</strong>,</p>
                                    <p>You have received a new booking for your venue <strong>${info.mahal_name}</strong>.</p>
                                    <div style="background: #fdfbf7; padding: 15px; border-radius: 8px; margin: 20px 0;">
                                        <p><strong>Customer:</strong> ${info.user_name} (${info.user_email})</p>
                                        <p><strong>Duration:</strong> ${startDate} to ${endDate}</p>
                                        <p><strong>Total Revenue:</strong> ₹${totalPrice}</p>
                                    </div>
                                    <p>Please check your dashboard for further details.</p>
                                    <p style="margin-top: 30px; font-size: 12px; color: #8a6a2f;">© ${new Date().getFullYear()} Hallify - Curating Grandeur</p>
                                </div>
                            `
                        });

                        res.status(200).json({ message: "Booking confirmed and notifications sent!" });
                    } catch (mailErr) {
                        console.error("Mailer error:", mailErr);
                        res.status(200).json({ message: "Booking confirmed, but failed to send notifications." });
                    }
                });
            });
        });
    });
} catch (err) {
    res.status(500).json({ error: err.message });
}
};


/**
 * Get all confirmed bookings for a specific Mahal
 */
exports.getMahalBookings = (req, res) => {
    const mahalId = req.params.id;
    const query = `SELECT start_date, end_date FROM bookings WHERE mahal_id = $1 AND status = 'confirmed'`;

    db.query(query, [mahalId], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(200).json(results.rows);
    });
};

/**
 * Get bookings for the logged-in user (User Dashboard)
 */
exports.getUserBookings = (req, res) => {
    try {
        const { id: userId } = getUserFromHeader(req);
        const query = `
            SELECT b.*, m.name as mahal_name, m.location as mahal_location 
            FROM bookings b
            JOIN mahals m ON m.id = b.mahal_id
            WHERE b.user_id = $1
            ORDER BY b.created_at DESC
        `;
        db.query(query, [userId], (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.status(200).json(result.rows);
        });
    } catch (err) {
        res.status(401).json({ error: "Unauthorized" });
    }
};

/**
 * Get bookings for mahals owned by the logged-in user (Owner Dashboard)
 */
exports.getOwnerBookings = (req, res) => {
    try {
        const { id: userId } = getUserFromHeader(req);
        const query = `
            SELECT b.*, m.name as mahal_name, u."fullName" as user_name, u.email as user_email
            FROM bookings b
            JOIN mahals m ON m.id = b.mahal_id
            JOIN users u ON u.id = b.user_id
            WHERE m.owner_id = $1
            ORDER BY b.created_at DESC
        `;
        db.query(query, [userId], (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.status(200).json(result.rows);
        });
    } catch (err) {
        res.status(401).json({ error: "Unauthorized" });
    }
};

/**
 * Get all bookings (Admin Dashboard)
 */
exports.getAllBookings = (req, res) => {
    const { role } = getUserFromHeader(req);
    if (role !== 'admin') {
        return res.status(403).json({ message: "Admin access required" });
    }

    const query = `
        SELECT b.*, m.name as mahal_name, u."fullName" as user_name
        FROM bookings b
        JOIN mahals m ON m.id = b.mahal_id
        JOIN users u ON u.id = b.user_id
        ORDER BY b.created_at DESC
    `;
    db.query(query, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(200).json(result.rows);
    });
};
