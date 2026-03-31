const express = require('express');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();
const SECRET = 'readit-secret-do-not-use-in-prod';
const PORT = 3001;
const USERS = {
    'user@readit.dev': 'password123'
};

app.use(cors());
app.use(express.json());

app.post('/auth/login', (req, res) => {
    console.log("LOGG IN Request :", req.body);
    const {
        email,
        password
    } = req.body;
    if (!USERS[email] || USERS[email] !== password) {
        return res.status(401).json({
            error: 'Invalid credentials'
        });
    }
    const token = jwt.sign({
            sub: email,
            iat: Math.floor(Date.now() / 1000)
        },
        SECRET, {
            expiresIn: '24h'
        },
    );
    res.json({
        token
    });
});

app.get('/auth/verify', (req, res) => {
    const header = req.headers.authorization ? req.headers.authorization : '';
    const token = header.replace('Bearer ', '');
    try {
        const payload = jwt.verify(token, SECRET);
        res.json({
            valid: true,
            payload
        });
    } catch {
        res.status(401).json({
            valid: false
        });
    }
});

app.listen(PORT, () =>
    console.log(`Auth stub running on http://localhost:${PORT}`),
);