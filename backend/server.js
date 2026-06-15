require("dotenv").config();

const express = require("express");
const cors = require("cors");
const db = require("./db");

const app = express();

app.use(cors());
app.use(express.json());

const PORT = 5000;

/* Home */
app.get("/", (req, res) => {
    res.send("Task Manager Backend Running Successfully!");
});

/* Ping */
app.get("/ping", (req, res) => {
    res.send("Backend Connected");
});

/* Register */
app.post("/register", (req, res) => {

    const { username, email, password } = req.body;

    const sql =
        "INSERT INTO users (username,email,password) VALUES (?,?,?)";

    db.query(
        sql,
        [username, email, password],
        (err, result) => {

             if(err){

    if(err.code === "ER_DUP_ENTRY"){
        return res.send("Email Already Registered");
    }

    console.log(err);
    return res.status(500).send("Registration Failed");
}

            res.send("Registration Successful");
        }
    );
});

/* Login */
app.post("/login", (req, res) => {

    const { email, password } = req.body;

    const sql =
        "SELECT * FROM users WHERE email=? AND password=?";

    db.query(
        sql,
        [email, password],
        (err, results) => {

            if (err) {
                console.log(err);
                return res.status(500).send("Login Failed");
            }

            if (results.length > 0) {
                res.send("Login Successful");
            } else {
                res.send("Invalid Credentials");
            }
        }
    );
});

/* Add Task */
app.post("/add-task", (req, res) => {

    const {
        title,
        category,
        priority,
        status,
        due_date
    } = req.body;

    const sql = `
    INSERT INTO tasks
    (title, category, priority, status, due_date)
    VALUES (?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [title, category, priority, status, due_date],
        (err, result) => {

            if (err) {
                console.log(err);
                return res.status(500).send("Error");
            }

            res.send("Task Added Successfully");
        }
    );
});

/* Get Tasks */
app.get("/tasks", (req, res) => {

    const sql = "SELECT * FROM tasks";

    db.query(sql, (err, results) => {

        if (err) {
            console.log(err);
            return res.status(500).send("Error");
        }

        res.json(results);
    });
});

/* Delete Task */
app.get("/delete-task/:id", (req, res) => {

    const id = req.params.id;

    db.query(
        "DELETE FROM tasks WHERE id=?",
        [id],
        (err, result) => {

            if (err) {
                console.log(err);
                return res.status(500).send("Error");
            }

            res.send("Task Deleted Successfully");
        }
    );
});

/* Complete Task */
app.get("/complete-task/:id", (req, res) => {

    const id = req.params.id;

    db.query(
        "UPDATE tasks SET status='Completed' WHERE id=?",
        [id],
        (err, result) => {

            if (err) {
                console.log(err);
                return res.status(500).send("Error");
            }

            res.send("Task Marked as Completed");
        }
    );
});

/* Clear All */
app.get("/clear-all", (req, res) => {

    db.query(
        "DELETE FROM tasks",
        (err, result) => {

            if (err) {
                console.log(err);
                return res.status(500).send("Error");
            }

            res.send("All Tasks Deleted");
        }
    );
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});