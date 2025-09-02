const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const prisma = require('./db/db');
dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Modular routes
app.get('/', (req, res) => res.send('working'));
app.use('/jobs', require('./routes/job'));
app.use('/attachments', require('./routes/attachment'));
app.use('/apply', require('./routes/apply'));

// User routes (register/login)
app.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            res.json({ error: 'Please submit full details' });
            return;
        }
        if (await prisma.user.findUnique({ where: { email } })) {
            res.json({ error: 'Email already exists' });
            return;
        }
        const user = await prisma.user.create({ data: { name, email, password } });
        res.json({ data: user, msg: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        res.json({ error: 'Please submit full details' });
        return;
    }
    const user = await prisma.user.findUnique({ where: { email } });
    if (user && user.password === password) {
        res.json({ data: user, msg: 'User logged in successfully' });
    } else {
        res.json({ error: 'Invalid email or password' });
    }
});

app.listen(PORT, () => {
    console.log(`server running on http://localhost:${PORT}/`);
});
