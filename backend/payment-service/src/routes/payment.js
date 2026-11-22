const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const nodemailer = require('nodemailer');
const db = require('../config/db');

// Transporter configuration matching original server.js
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER || 'hexaxotics@gmail.com',
        pass: process.env.EMAIL_PASS || 'izmw mzcn qyyr ycqn'
    }
});

// Helper to find image asset on disk
function resolveAssetPath(image) {
    if (!image) return null;
    const imageName = image.split('/').pop().split('?')[0];
    const candidatePaths = [
        path.resolve(__dirname, '../../../../frontend/public/assets', imageName),
        path.resolve(__dirname, '../../../data/assets', imageName),
        path.resolve(__dirname, '../../../../assets', imageName),
        path.resolve(__dirname, '../../../assets', imageName)
    ];
    return candidatePaths.find(p => fs.existsSync(p)) || candidatePaths[0];
}

// POST /api/send-order-email
router.post('/send-order-email', async (req, res) => {
    const { userEmail, carModel, totalPrice, image } = req.body;

    if (!userEmail || !carModel) {
        return res.status(400).json({ error: "userEmail and carModel are required" });
    }

    const imagePath = resolveAssetPath(image);
    const imageName = imagePath ? path.basename(imagePath) : 'car.jpg';

    const mailOptions = {
        from: '"HEXA XOTICS" <hexaxotics@gmail.com>',
        to: userEmail,
        subject: 'Order Confirmation - HEXA XOTICS',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px; border-radius: 8px;">
                <div style="text-align: center; margin-bottom: 20px;">
                    <h1 style="color: #950045; letter-spacing: 2px; margin: 0;">HEXA XOTICS</h1>
                    <p style="color: #666; font-size: 13px; text-transform: uppercase; margin-top: 5px;">Luxury & Exotic Supercars</p>
                </div>
                <h2 style="color: #c71585; text-align: center;">Order Confirmed!</h2>
                <p>Thank you for choosing HEXA XOTICS. Your exotic automobile reservation has been finalized.</p>
                <div style="background: #f9f9f9; padding: 18px; border-radius: 8px; border: 1px solid #eaeaea;">
                    <h3 style="margin-top: 0; color: #111;">Order Details:</h3>
                    ${fs.existsSync(imagePath) ? `<img src="cid:carImage" alt="Car" style="width: 100%; max-width: 380px; display: block; margin: 0 auto 15px; border-radius: 6px;">` : ''}
                    <p><strong>Car:</strong> ${carModel}</p>
                    <p><strong>Total Paid:</strong> <span style="color: #c71585; font-weight: bold; font-size: 18px;">${totalPrice}</span></p>
                    <p><strong>Status:</strong> Confirmed & Preparing for White-Glove Delivery</p>
                </div>
                <p style="text-align: center; margin-top: 25px; color: #555;">Our concierge team will reach out to schedule delivery. We hope to see you again!</p>
                <div style="text-align: center; border-top: 1px solid #eee; margin-top: 20px; padding-top: 15px; font-size: 12px; color: #999;">
                    HEXA XOTICS Dealership &bull; All Rights Reserved
                </div>
            </div>
        `
    };

    if (imagePath && fs.existsSync(imagePath)) {
        mailOptions.attachments = [{
            filename: imageName,
            path: imagePath,
            cid: 'carImage'
        }];
    }

    try {
        await transporter.sendMail(mailOptions);
        console.log(`[Payment Service] Email sent successfully to ${userEmail}`);
        res.status(200).json({ success: true, message: 'Email sent successfully' });
    } catch (error) {
        console.error("[Payment Service] Nodemailer Error:", error.message);
        // Note: Even if Gmail blocks due to app password or network, don't crash checkout
        res.status(200).json({
            success: false,
            message: 'Order placed, email delivery notification attempted',
            error: error.message
        });
    }
});

// POST /api/checkout or /api/orders
router.post('/checkout', (req, res) => {
    const {
        userId, userEmail, carId, carModel,
        basePrice, luxuryTax, docFee, totalPrice,
        paymentMethod, cardNumber, cardholderName
    } = req.body;

    const cardLast4 = cardNumber ? cardNumber.replace(/\s/g, '').slice(-4) : 'N/A';

    const sql = `INSERT INTO orders (
        user_id, user_email, car_id, car_model,
        base_price, luxury_tax, doc_fee, total_price,
        payment_method, card_last4, cardholder_name
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    db.run(sql, [
        userId || null, userEmail || '', carId || null, carModel || 'Exotic Supercar',
        basePrice || 0, luxuryTax || 0, docFee || 299, totalPrice || 0,
        paymentMethod || 'Credit Card', cardLast4, cardholderName || ''
    ], function(err) {
        if (err) return res.status(400).json({ error: err.message });
        res.status(201).json({
            success: true,
            message: "Order placed and payment processed successfully!",
            orderId: this.lastID,
            order: {
                id: this.lastID,
                carModel,
                totalPrice,
                cardLast4
            }
        });
    });
});

// GET /api/orders/:id
router.get('/orders/:id', (req, res) => {
    const sql = "SELECT * FROM orders WHERE id = ?";
    db.get(sql, [req.params.id], (err, order) => {
        if (err) return res.status(400).json({ error: err.message });
        if (!order) return res.status(404).json({ error: "Order not found" });
        res.json({ message: "success", data: order });
    });
});

module.exports = router;
