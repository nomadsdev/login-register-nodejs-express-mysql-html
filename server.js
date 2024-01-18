const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));

// เชื่อมต่อกับ MySQL Database
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'login_register_nakk'
});

// ตรวจสอบสถานะการ Login
let isLoggedIn = false;

// เริ่มต้นเรียกหน้าหลักหรือหน้า Login
app.get('/', (req, res) => {
    // ถ้า Login แล้ว, ส่งไปยัง home.html
    if (isLoggedIn) {
        res.sendFile(__dirname + '/home.html');
    } else {
        res.sendFile(__dirname + '/login.html');
    }
});

// เรียกหน้า Register
app.get('/register', (req, res) => {
    res.sendFile(__dirname + '/register.html');
});

// รับข้อมูลจากฟอร์ม Login และตรวจสอบในฐานข้อมูล
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    db.query('SELECT * FROM user_table WHERE username = ? AND password = ?', [username, password], (error, results) => {
        if (error) throw error;

        if (results.length > 0) {
            // ถ้า Login สำเร็จ, ส่งไปยัง home.html
            isLoggedIn = true;
            res.redirect('/');
        } else {
            res.send(
                `<h1>Error Login falied</h1>`);
        }
    });
});

// รับข้อมูลจากฟอร์ม Register และเพิ่มข้อมูลผู้ใช้ใหม่ในฐานข้อมูล
app.post('/register', (req, res) => {
    const { username, password } = req.body;

    db.query('INSERT INTO user_table (username, password) VALUES (?, ?)', [username, password], (error, results) => {
        if (error) throw error;

        res.send('Registration successful');
    });
});

// ปุ่ม Logout
app.get('/logout', (req, res) => {
    isLoggedIn = false;
    res.redirect('/');
});

// เริ่มต้นเซิร์ฟเวอร์
app.listen(port, () => {
    console.log('Server is running');
});