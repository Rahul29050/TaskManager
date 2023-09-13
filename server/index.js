const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors =require('cors')
const app = express();

app.use(bodyParser.json());
app.use(cors())
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '12345678',
  database: 'taskmanager',
});

db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log('Connected to MySQL');
});

const secretKey = 'your_secret_key';

app.post('/register', (req, res) => {
  const { username, password, email } = req.body;

  bcrypt.hash(password, 10, (err, hash) => {
    if (err) {
      res.status(500).json({ error: 'Failed to hash password' });
    } else {
      const user = { username, password: hash, email };
      const sql = 'INSERT INTO users SET ?';
      db.query(sql, user, (err) => {
        if (err) {
          res.status(500).json({ error: err });
        } else {
          res.status(200).json({ message: 'User registered successfully' });
        }
      });
    }
  });
});

app.post('/login', (req, res) => {
  const { email, password } = req.body;

  const sql = 'SELECT * FROM users WHERE email = ?';
  db.query(sql, [email], (err, results) => {
    if (err) {
      res.status(500).json({ error: 'Failed to query database' });
    } else if (results.length === 0) {
      res.status(401).json({ error: 'Authentication failed. User not found' });
    } else {
      const user = results[0];
      console.log(user);
      bcrypt.compare(password, user.password, (err, match) => {
        if (err || !match) {
          res.status(401).json({ error: 'Authentication failed. Incorrect password' });
        } else {
          const token = jwt.sign({ email }, secretKey, { expiresIn: '1h' });
          console.log(user);
          res.status(200).json({ token, user });
        }
      });
    }
  });
});

app.post('/addTask', (req, res) => {
  const { Title, Description, DueDate, Priority, Category,user } = req.body;

  const task = { Title, Description, DueDate, Priority, Category,user };
  const sql = 'INSERT INTO tasks SET ?';
  db.query(sql, task, (err, result) => {
    if (err) {
      res.status(500).json({ error: err });
    } else {
      res.status(200).json({ message: 'Task added successfully', taskId: result.insertId });
    }
  });
});

app.get('/tasks', (req, res) => {

  const sql = 'SELECT * FROM tasks ';
  db.query(sql, (err, results) => {
    if (err) {
      res.status(500).json({ error: err });
    } else {
      res.status(200).json(results);
    }
  });
});

app.get('/tasks/:taskId', (req, res) => {
  const taskId = req.params.taskId;

  const sql = 'SELECT * FROM tasks WHERE id = ?';
  db.query(sql, [taskId], (err, results) => {
    if (err) {
      res.status(500).json({ error: err });
    } else if (results.length === 0) {
      res.status(404).json({ error: 'Task not found' });
    } else {
      res.status(200).json(results[0]);
    }
  });
});

app.put('/tasks/:taskId', (req, res) => {
  const taskId = req.params.taskId;
  const { Title, Description, DueDate, Priority, Category } = req.body;

  const updatedTask = { Title, Description, DueDate, Priority, Category };
  const sql = 'UPDATE tasks SET ? WHERE id = ?';
  db.query(sql, [updatedTask, taskId], (err, result) => {
    if (err) {
      res.status(500).json({ error: err });
    } else if (result.affectedRows === 0) {
      res.status(404).json({ error: 'Task not found' });
    } else {
      res.status(200).json({ message: 'Task updated successfully' });
    }
  });
});

app.delete('/tasks/:taskId', (req, res) => {
  const taskId = req.params.taskId;

  const sql = 'DELETE FROM tasks WHERE id = ?';
  db.query(sql, [taskId], (err, result) => {
    if (err) {
      res.status(500).json({ error: err });
    } else if (result.affectedRows === 0) {
      res.status(404).json({ error: 'Task not found' });
    } else {
      res.status(200).json({ message: 'Task deleted successfully' });
    }
  });
});

app.get('/users/:userId', (req, res) => {
  const userId = req.params.userId;

  const sql = 'SELECT * FROM users WHERE id = ?';
  db.query(sql, [userId], (err, results) => {
    if (err) {
      res.status(500).json({ error: err });
    } else if (results.length === 0) {
      res.status(404).json({ error: 'User not found' });
    } else {
      const user = results[0];
      const { password, ...userData } = user;
      res.status(200).json(userData);
    }
  });
});

app.post('/change-password/:userId', (req, res) => {
  const userId = req.params.userId;
  const { newPassword } = req.body;


  bcrypt.hash(newPassword, 10, (err, hash) => {
    if (err) {
      res.status(500).json({ error: 'Failed to hash new password' });
    } else {
      const sql = 'UPDATE users SET password = ? WHERE id = ?';
      db.query(sql, [hash, userId], (err, result) => {
        if (err) {
          res.status(500).json({ error: err });
        } else if (result.affectedRows === 0) {
          res.status(404).json({ error: 'User not found' });
        } else {
          res.status(200).json({ message: 'Password updated successfully' });
        }
      });
    }
  });
});




const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
