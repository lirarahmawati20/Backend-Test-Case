import express from 'express';
import db from '../db.js';

const router = express.Router();

router.get('/', (req, res) => {
    db.query('SELECT * FROM Books', (err, results) => {
        if (err) {
            console.error('Terjadi kesalahan saat mengambil buku:', err);
            res.status(500).json({
                message: 'Terjadi kesalahan saat mengambil buku'
            });
        } else {
            res.json(results);
        }
    });
});

export default router;
