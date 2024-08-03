import express from 'express';
import db from '../db.js';

const router = express.Router();

router.get('/', (req, res) => {
    db.query('SELECT * FROM Members', (err, results) => {
        if (err) {
            console.error('Terjadi kesalahan saat mengambil anggota:', err);
            res.status(500).json({
                message: 'Terjadi kesalahan saat mengambil anggota'
            });
        } else {
            res.json(results);
        }
    });
});

export default router;
