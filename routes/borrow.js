import express from 'express';
import db from '../db.js';

const router = express.Router();

router.post('/', (req, res) => {
    const { memberId, bookId } = req.body;

    const checkBorrowedQuery = `
        SELECT COUNT(*) AS borrowed_count 
        FROM BorrowedBooks 
        WHERE member_id = ? AND returned_date IS NULL
    `;

    const checkBookAvailabilityQuery = `
        SELECT stock 
        FROM Books 
        WHERE id = ?
    `;

    const checkPenaltyQuery = `
        SELECT * 
        FROM Penalties 
        WHERE member_id = ? AND penalty_end_date > NOW()
    `;

    const borrowBookQuery = `
        INSERT INTO BorrowedBooks (member_id, book_id, borrowed_date) 
        VALUES (?, ?, NOW())
    `;

    const updateBookStockQuery = `
        UPDATE Books 
        SET stock = stock - 1 
        WHERE id = ?
    `;

    db.query(checkBorrowedQuery, [memberId], (err, results) => {
        if (err) {
            console.error('Terjadi kesalahan saat memeriksa buku yang dipinjam:', err);
            res.status(500).json({
                message: 'Terjadi kesalahan saat memeriksa buku yang dipinjam'
            });
            return;
        }
        const borrowedCount = results[0].borrowed_count;
        if (borrowedCount >= 2) {
            res.status(400).json({
                message: 'Anggota tidak boleh meminjam lebih dari 2 buku'
            });
            return;
        }

        db.query(checkBookAvailabilityQuery, [bookId], (err, results) => {
            if (err) {
                console.error('Terjadi kesalahan saat memeriksa ketersediaan buku:', err);
                res.status(500).json({
                    message: 'Terjadi kesalahan saat memeriksa ketersediaan buku'
                });
                return;
            }
            const bookStock = results[0].stock;
            if (bookStock <= 0) {
                res.status(400).json({
                    message: 'Buku tidak tersedia'
                });
                return;
            }

            db.query(checkPenaltyQuery, [memberId], (err, results) => {
                if (err) {
                    console.error('Terjadi kesalahan saat memeriksa penalti anggota:', err);
                    res.status(500).json({
                        message: 'Terjadi kesalahan saat memeriksa penalti anggota'
                    });
                    return;
                }
                if (results.length > 0) {
                    res.status(400).json({
                        message: 'Anggota sedang dalam masa penalti'
                    });
                    return;
                }

                db.query(borrowBookQuery, [memberId, bookId], (err) => {
                    if (err) {
                        console.error('Terjadi kesalahan saat meminjam buku:', err);
                        res.status(500).json({
                            message: 'Terjadi kesalahan saat meminjam buku'
                        });
                        return;
                    }

                    db.query(updateBookStockQuery, [bookId], (err) => {
                        if (err) {
                            console.error('Terjadi kesalahan saat memperbarui stok buku:', err);
                            res.status(500).json({
                                message: 'Terjadi kesalahan saat memperbarui stok buku'
                            });
                            return;
                        }

                        res.json({
                            message: 'Buku berhasil dipinjam'
                        });
                    });
                });
            });
        });
    });
});

export default router;
