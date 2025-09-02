const express  = require("express")
const cors = require("cors")
const bodyParser = require('body-parser')
const dotenv = require("dotenv")
const prisma = require("./db/db")
const multer = require("multer")
const upload = multer({ dest: "uploads/" })
const app = express()
app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

PORT = process.env.PORT || 3000

dotenv.config();


app.get("/",(req,res) => {
    res.send("working")
})

app.post("/register", async(req, res)=>{
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            res.json({
                "error": "Please submit full details"
            })
            return;
        }
        if (await prisma.user.findUnique({ where: { email } })) {
            res.json({
                "error": "Email already exists"
            });
            return;
        }
        const user = await prisma.user.create({
            data: {
                name,
                email,
                password
            }
        });
        res.json({
            "data": user,
            "msg": "User registered successfully"
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})

app.post("/login",async(req , res)=>{
    const { email, password } = req.body;
    if (!email || !password) {
        res.json({
            "error": "Please submit full details"
        });
        return;
    }
    const user = await prisma.user.findUnique({
        where: {
            email
        }
    });
    if (user && user.password === password) {
        res.json({
            "data": user,
            "msg": "User logged in successfully"
        });
    } else {
        res.json({
            "error": "Invalid email or password"
        });
    }
})


app.get("/jobs",async(req,res)=>{
    const { title, location, company, salary, type } = req.query;
    const where = {};
    if (title) where.title = { contains: title, mode: "insensitive" };
    if (location) where.location = { contains: location, mode: "insensitive" };
    if (company) where.company = { contains: company, mode: "insensitive" };
    if (salary) where.salary = { equals: parseInt(salary, 10) };
    if (type) where.type = { equals: type };
    const jobs = await prisma.job.findMany({ where });
    res.json({
        "data": jobs
    });
});

app.post("/jobs",async(req,res)=>{
    const { title, description, location, company, status , salary, type} = req.body;

    if (!title || !description || !location || !company || !status || !salary || !type) {
        res.json({
            "error": "Please submit full details"
        });
        return;
    }

    const job = await prisma.job.create({
        data: {
            title,
            description,
            location,
            company,
            status,
            salary,
            type
        }
    });

    res.json({
        "data": job,
        "msg": "Job created successfully"
    });
});


app.post("/attachments", upload.array("file"), async(req,res)=>{
   console.log(req.body)
   const userId = parseInt(req.body.userId, 10);
   const files = req.files

   if (!userId || !files || files.length === 0) {
       res.json({
           "error": "Please submit full details"
       });
       return;
   }

   const attachments = await Promise.all(files.map(file =>
       prisma.attachment.create({
           data: {
               userId,
               file: file.filename
           }
       })
   ));

   res.json({
       "data": attachments,
       "msg": "Attachments uploaded successfully"
   });
});

app.post("/apply", async (req, res) => {
    if (!req.body) {
        res.status(400).json({ error: "Missing request body" });
        return;
    }
    const { userId, jobId, attachmentIds } = req.body;
    let attachmentIdArray = attachmentIds;
    if (typeof attachmentIdArray === "string") {
        try {
            attachmentIdArray = JSON.parse(attachmentIdArray);
        } catch {
            attachmentIdArray = [attachmentIdArray];
        }
    }
    if (!userId || !jobId || !attachmentIdArray || !Array.isArray(attachmentIdArray) || attachmentIdArray.length === 0) {
        res.json({
            "error": "Please submit full details"
        });
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
        data: { status: "applied" } 
    });
    res.json({
        "data": application,
        "msg": "Job application submitted successfully"
    });
});

app.listen(PORT,()=>{
    console.log(`server running on http://localhost:${PORT}/`)
})
