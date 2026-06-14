const express = require("express");
const cors = require("cors");
const db = require("./db");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Task Manager Backend Running Successfully!");
});

const PORT = 5000;
app.get("/test-add", (req, res) => {

    const sql = `
    INSERT INTO tasks
    (title, category, priority, status, due_date)
    VALUES
    ('Learn NodeJS','Study','High','Pending','2026-06-20')
    `;

    db.query(sql, (err, result) => {

        if(err){
            console.log(err);
            return res.send("Error");
        }

        res.send("Task Added Successfully");

    });

});
app.get("/hello", (req, res) => {
    res.send("Hello Route Working");
});
app.get("/tasks", (req, res) => {

    const sql = "SELECT * FROM tasks";

    db.query(sql, (err, results) => {

        if(err){
            console.log(err);
            return res.status(500).send("Error");
        }

        res.json(results);

    });

});
app.get("/delete-task/:id", (req, res) => {

    const id = req.params.id;

    const sql = "DELETE FROM tasks WHERE id = ?";

    db.query(sql, [id], (err, result) => {

        if(err){
            console.log(err);
            return res.status(500).send("Error");
        }

        res.send("Task Deleted Successfully");

    });

});
app.get("/test-delete", (req, res) => {
    res.send("Delete Route Loaded");
});
app.get("/complete-task/:id", (req, res) => {

    const id = req.params.id;

    const sql = `
    UPDATE tasks
    SET status = 'Completed'
    WHERE id = ?
    `;

    db.query(sql, [id], (err, result) => {

        if(err){
            console.log(err);
            return res.status(500).send("Error");
        }

        res.send("Task Marked as Completed");

    });

});
app.get("/ping", (req, res) => {
    res.send("Backend Connected");
});
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

            if(err){
                console.log(err);
                return res.status(500).send("Error");
            }

            res.send("Task Added Successfully");

        }
    );

});
app.get("/test-register", (req, res) => {
    res.send("Register Route Working");
});
app.post("/register", (req, res) => {

    const { username, email, password } = req.body;

    const sql = `
    INSERT INTO users
    (username, email, password)
    VALUES (?, ?, ?)
    `;

    db.query(
        sql,
        [username, email, password],
        (err, result) => {

            if(err){
                console.log(err);
                return res.status(500).send("Registration Failed");
            }

            res.send("Registration Successful");

        }
    );

});
app.post("/login", (req, res) => {

    const { email, password } = req.body;

    const sql =
    "SELECT * FROM users WHERE email = ? AND password = ?";

    db.query(
        sql,
        [email, password],
        (err, results) => {

            if(err){
                console.log(err);
                return res.status(500).send("Login Failed");
            }

            if(results.length > 0){
                res.send("Login Successful");
            }
            else{
                res.send("Invalid Credentials");
            }

        }
    );

});
app.get("/clear-all", (req, res) => {

    const sql = "DELETE FROM tasks";

    db.query(sql, (err, result) => {

        if(err){
            console.log(err);
            return res.status(500).send("Error");
        }

        res.send("All Tasks Deleted");

    });

});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});