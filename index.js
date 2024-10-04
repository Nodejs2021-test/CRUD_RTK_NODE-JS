const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MySQL connection
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "user_management",
});

// Connect to the database
db.connect((err) => {
    if (err) throw err;
    console.log("MySQL Connected!");
});

// Create User
app.post("/api/users", (req, res) => {
    const { name, email, age, gender } = req.body;  
    const query = "INSERT INTO users (name, email, age, gender) VALUES (?, ?, ?, ?)";
    db.query(query, [name, email, age, gender], (err, result) => {
        if (err) return res.status(500).json({ message: err.message });
        res.status(201).json({ id: result.insertId, name, email, age, gender }); 
    });
});

// Read Users
app.get("/api/users", (req, res) => {
    const query = "SELECT * FROM users";
    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ message: err.message });
        res.json(results);
    });
});

// Update User
app.put("/api/users/:id", (req, res) => {
    const { id } = req.params;
    const { name, email, age, gender } = req.body; 
    const query = "UPDATE users SET name = ?, email = ?, age = ?, gender = ? WHERE id = ?";
    db.query(query, [name, email, age, gender, id], (err) => {
        if (err) return res.status(500).json({ message: err.message });
        res.json({ id, name, email, age, gender }); 
    });
});

// Delete User
app.delete("/api/users/:id", (req, res) => {
    const { id } = req.params;
    const query = "DELETE FROM users WHERE id = ?";
    db.query(query, [id], (err) => {
        if (err) return res.status(500).json({ message: err.message });
        res.status(204).send();
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
