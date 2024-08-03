DROP DATABASE library_management;
CREATE DATABASE library_management;
USE library_management;

CREATE TABLE IF NOT EXISTS Books (
    id INT AUTO_INCREMENT PRIMARY KEY,
    CODE VARCHAR(10) NOT NULL,
    title VARCHAR(100) NOT NULL,
    author VARCHAR(100) NOT NULL,
    stock INT NOT NULL
);

CREATE TABLE IF NOT EXISTS Members (
    id INT AUTO_INCREMENT PRIMARY KEY,
    CODE VARCHAR(10) NOT NULL,
    NAME VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS BorrowedBooks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    member_id INT,
    book_id INT,
    borrowed_date DATE,
    returned_date DATE,
    FOREIGN KEY (member_id) REFERENCES Members(id),
    FOREIGN KEY (book_id) REFERENCES Books(id)
);

CREATE TABLE IF NOT EXISTS Penalties (
    id INT AUTO_INCREMENT PRIMARY KEY,
    member_id INT,
    penalty_end_date DATE,
    FOREIGN KEY (member_id) REFERENCES Members(id)
);

INSERT INTO Books (CODE, title, author, stock) VALUES 
    ('JK-45', 'Harry Potter', 'J.K Rowling', 1),
    ('SHR-1', 'A Study in Scarlet', 'Arthur Conan Doyle', 1),
    ('TW-11', 'Twilight', 'Stephenie Meyer', 1),
    ('HOB-83', 'The Hobbit, or There and Back Again', 'J.R.R. Tolkien', 1),
    ('NRN-7', 'The Lion, the Witch and the Wardrobe', 'C.S. Lewis', 1);

INSERT INTO Members (CODE, NAME) VALUES 
    ('M001', 'Angga'),
    ('M002', 'Ferry'),
    ('M003', 'Putri');
    
 INSERT INTO Penalties (member_id, penalty_end_date) VALUES
(1, DATE_ADD(NOW(), INTERVAL 3 DAY));
