import express from 'express';
import db from '../db.js';

const router = express.Router();

router.post('/', (req, res) => {
    const { memberId, bookId } = req.body;

    const checkBorrowedBookQuery = `
        SELECT * 
        FROM BorrowedBooks 
        WHERE member_id = ? AND book_id = ? AND returned_date IS NULL
    `;

    const returnBookQuery = `
        UPDATE BorrowedBooks 
        SET returned_date = NOW() 
        WHERE member_id = ? AND book_id = ? AND returned_date IS NULL
    `;

    const updateBookStockQuery = `
        UPDATE Books 
        SET stock = stock + 1 
        WHERE id = ?
    `;

    const insertPenaltyQuery = `
        INSERT INTO Penalties (member_id, penalty_end_date) 
        VALUES (?, ?)
    `;

    db.query(checkBorrowedBookQuery, [memberId, bookId], (err, results) => {
        if (err) {
            console.error('Error checking borrowed book:', err);
            res.status(500).json({ message: 'Error checking borrowed book' });
            return;
        }

        if (results.length === 0) {
            res.status(400).json({ message: 'Book not borrowed by this member' });
            return;
        }

        const borrowedBook = results[0];
        const borrowedDate = new Date(borrowedBook.borrowed_date);
        const currentDate = new Date();
        const diffDays = Math.floor((currentDate - borrowedDate) / (1000 * 60 * 60 * 24));

        db.query(returnBookQuery, [memberId, bookId], (err) => {
            if (err) {
                console.error('Error returning book:', err);
                res.status(500).json({ message: 'Error returning book' });
                return;
            }

            db.query(updateBookStockQuery, [bookId], (err) => {
                if (err) {
                    console.error('Error updating book stock:', err);
                    res.status(500).json({ message: 'Error updating book stock' });
                    return;
                }

                if (diffDays > 7) {
                    const penaltyEndDate = new Date();
                    penaltyEndDate.setDate(penaltyEndDate.getDate() + 3);
                    db.query(insertPenaltyQuery, [memberId, penaltyEndDate], (err) => {
                        if (err) {
                            console.error('Error inserting penalty:', err);
                            res.status(500).json({ message: 'Error inserting penalty' });
                            return;
                        }

                        res.json({ message: 'Book returned, member penalized' });
                    });
                } else {
                    res.json({ message: 'Book returned successfully' });
                }
            });
        });
    });
});

export default router;
