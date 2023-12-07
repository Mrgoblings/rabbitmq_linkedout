const express = require('express');
const mysql = require('mysql');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const app = express();
const port = 3001;
const secretKey = 'eJ8W!4hZ2qUv#sY@9Lp*6aGy'; 

// Create a MySQL connection
const db = mysql.createConnection({
    host: 'mysql',
    user: 'linkedout_user',
    password: 'linkedout_password',
    database: 'linkedout'
});

// Connect to MySQL
db.connect((err) => {
    if (err) {
        console.error('MySQL connection failed:', err);
    } else {
        console.log('Connected to MySQL database');
    }
});


// Use CORS middleware
const corsOptions = {
    origin: 'http://localhost:80',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    optionsSuccessStatus: 204,
};

app.use(cors(corsOptions)); 

// Express middleware for parsing JSON bodies
app.use(express.json());
app.use(cookieParser());

app.get('/', (req, res) => {
    res.send('Hello, from mysql api!!!');
});

// Signup endpoint
app.post('/signup', (req, res) => {
    const { email, password } = req.body;

    // Insert user into the database
    const query = 'INSERT INTO users (email, password) VALUES (?, ?)';
    db.query(query, [email, password], (err, result) => {
        if (err) {
            console.error('Signup failed:', err);
            res.status(500).send('Signup failed');
        } else {
            // Generate a JWT token
            const token = jwt.sign({ email }, secretKey, { expiresIn: '1h' });

            // Set the token in a cookie
            res.cookie('token', token, { httpOnly: true });
            res.status(201).send('Signup successful');
        }
    });
});

// Signin endpoint
app.post('/signin', (req, res) => {
    const { email, password } = req.body;

    // Check user credentials
    const query = 'SELECT * FROM users WHERE email = ? AND password = ?';
    db.query(query, [email, password], (err, result) => {
        if (err) {
            console.error('Signin failed:', err);
            res.status(500).send('Signin failed');
        } else {
            if (result.length > 0) {
                // Generate a JWT token
                const token = jwt.sign({ email }, secretKey, { expiresIn: '1h' });

                // Set the token in a cookie
                res.cookie('token', token, { httpOnly: true });
                res.status(200).send('Signin successful');
            } else {
                res.status(401).send('Invalid credentials');
            }
        }
    });
});

// Protected endpoint
app.get('/protected', authenticateToken, (req, res) => {
    res.send('You have access to the protected endpoint!');
});

// Middleware to authenticate the JWT token
function authenticateToken(req, res, next) {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).send('Unauthorized');
    }

    jwt.verify(token, secretKey, (err, user) => {
        if (err) {
            return res.status(403).send('Forbidden');
        }

        req.user = user;
        next();
    });
}

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
