import dotenv from 'dotenv'; // Import dotenv
import mysql from 'mysql'; // Import mysql
dotenv.config(); // Memuat variabel lingkungan dari file .env

// Konfigurasi koneksi database menggunakan variabel lingkungan
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT, // Menambahkan port jika diperlukan
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

// Menyambungkan ke database
db.connect((err) => {
    if (err) {
        console.error('Error connecting:', err);
        return;
    }
    console.log('Connected as id ' + db.threadId);
});

export default db;
