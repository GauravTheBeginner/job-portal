const express = require('express');
const router = express.Router();
const prisma = require('../db/db');


router.post('/', async (req, res) => {
    if (!req.body) {
        res.status(400).json({ error: 'Missing request body' });
        return;
    }
    const { userId, jobId, attachmentIds } = req.body;
    let attachmentIdArray = attachmentIds;
    if (typeof attachmentIdArray === 'string') {
        try {
            attachmentIdArray = JSON.parse(attachmentIdArray);
        } catch {
            attachmentIdArray = [attachmentIdArray];
        }
    }
    if (!userId || !jobId || !attachmentIdArray || !Array.isArray(attachmentIdArray) || attachmentIdArray.length === 0) {
        res.json({ error: 'Please submit full details' });
        return;
    }
    // Check if user already applied for this job
    const existing = await prisma.application.findFirst({
        where: {
            userId: parseInt(userId, 10),
            jobId: parseInt(jobId, 10)
        }
    });
    if (existing) {
        res.status(400).json({ error: 'You have already applied for this job.' });
        return;
    }
    const application = await prisma.application.create({
        data: {
            userId: parseInt(userId, 10),
            jobId: parseInt(jobId, 10),
            attachments: {
                connect: attachmentIdArray.map(id => ({ id: parseInt(id, 10) }))
            }
        }
    });
    await prisma.job.update({
        where: { id: parseInt(jobId, 10) },
        data: { status: 'applied' }
    });
    res.json({ data: application, msg: 'Job application submitted successfully' });
});

module.exports = router;
