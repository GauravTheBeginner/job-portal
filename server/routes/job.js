const express = require('express');
const router = express.Router();
const prisma = require('../db/db');


router.get('/', async (req, res) => {
    const { title, location, company, salary, type } = req.query;
    const where = {};
    if (title) where.title = { contains: title, mode: 'insensitive' };
    if (location) where.location = { contains: location, mode: 'insensitive' };
    if (company) where.company = { contains: company, mode: 'insensitive' };
    if (salary) where.salary = { equals: parseInt(salary, 10) };
    if (type) where.type = { equals: type };
    const jobs = await prisma.job.findMany({ where });
    res.json({ data: jobs });
});

// POST create job
router.post('/', async (req, res) => {
    const { title, description, location, company, status, salary, type } = req.body;
    if (!title || !description || !location || !company || !status || !salary || !type) {
        res.json({ error: 'Please submit full details' });
        return;
    }
    const job = await prisma.job.create({
        data: { title, description, location, company, status, salary: parseInt(salary, 10), type }
    });
    res.json({ data: job, msg: 'Job created successfully' });
});


module.exports = router;
