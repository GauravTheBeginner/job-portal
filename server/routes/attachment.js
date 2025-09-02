const express = require('express');
const router = express.Router();
const prisma = require('../db/db');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });


router.post('/', upload.array('file'), async (req, res) => {
    const userId = parseInt(req.body.userId, 10);
    const files = req.files;
    if (!userId || !files || files.length === 0) {
        res.json({ error: 'Please submit full details' });
        return;
    }
    const attachments = await Promise.all(files.map(file =>
        prisma.attachment.create({
            data: { userId, file: file.filename }
        })
    ));
    res.json({ data: attachments, msg: 'Attachments uploaded successfully' });
});

module.exports = router;
