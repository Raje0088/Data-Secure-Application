const { autoBackupEmailModel } = require("../models/autoBackupModel")
const fs = require("fs");
const cron = require('node-cron');
const _ = require("lodash");
const { exec } = require("child_process")
const path = require("path")
const nodemailer = require("nodemailer")
const archiver = require("archiver")


const creatAutoBackupEmails = async (req, res) => {
    try {
        const { email, userId = "SA" } = req.body;
        console.log("emai", email)
        const result = await autoBackupEmailModel.create(
            {
                email_db: email,
                userId_db: userId
            }
        )
        console.log("email successfully loaded", result)
        res.status(200).json({ message: "email successfully loaded", result })
    } catch (err) {
        console.log("internal error", err)
        res.status(500).json({ message: "internal error", err: err.message })
    }
}
const updateAutoBackupEmails = async (req, res) => {
    try {
        const id = req.params.id;
        const { email, userId } = req.body;
        const result = await autoBackupEmailModel.findByIdAndUpdate(
            { _id: id },
            {
                $set: {
                    email_db: email,
                    userId_db: userId,
                }
            },
            { new: true },
        )
        console.log("email successfully loaded", result)
        res.status(200).json({ message: "email successfully loaded", result })
    } catch (err) {
        console.log("internal error", err)
        res.status(500).json({ message: "internal error", err: err.message })
    }
}
const deleteAutoBackupEmails = async (req, res) => {
    try {
        const id = req.params.id;
        const result = await autoBackupEmailModel.deleteOne({ _id: id })
        console.log("email successfully loaded", result)
        res.status(200).json({ message: "email successfully found", result })
    } catch (err) {
        console.log("internal error", err)
        res.status(500).json({ message: "internal error", err: err.message })
    }
}
const getAutoBackupEmails = async (req, res) => {
    try {
        const result = await autoBackupEmailModel.find()
        console.log("email successfully loaded", result)
        res.status(200).json({ message: "email successfully found", result })
    } catch (err) {
        console.log("internal error", err)
        res.status(500).json({ message: "internal error", err: err.message })
    }
}
cron.schedule('32 17 * * *', async () => {
    try {
        const date = new Date()
        const backupDir = `D:/project/MongoBackUp/mongoDump-${date.toISOString().split("T")[0]}`;

        const url = "mongodb+srv://transformtoday001:admin@raj.emaxz.mongodb.net/createTables"
        const cmd = `mongodump --uri="${url}" --out="${backupDir}"`

        exec(cmd, (error, stdout, stderr) => {
            if (error) {
                console.error("backup error", error.message);
                return;
            }
            console.log("✅ MongoDB Backup Completed:", backupDir);

            const zipFile = `${backupDir}.zip`
            const safeZipFile = `${backupDir}.backup`;

            const output = fs.createWriteStream(zipFile);
            const archive = archiver("zip", {
                zlib: { level: 9 },
                encryptionMethod: "zip20",
                password: "123"
            })
            archive.pipe(output);
            archive.directory(backupDir, false)
            archive.finalize()
            output.on("close", async () => {
                console.log("✅ Backup compressed & encrypted:", zipFile, archive.pointer(), "bytes");

                // if (fs.existsSync(zipFile)) {
                //     fs.renameSync(zipFile, safeZipFile);
                //     console.log("Renamed to safe extension", safeZipFile)
                // } else {
                //     console.error("Zip file not found, cannot rename.");
                //     return;
                // }



                const emails = await autoBackupEmailModel.find({}, { email_db: 1, _id: 0 })
                const BackupEmails = emails.map((e) => e.email_db)

                const transporter = nodemailer.createTransport({
                    service: "gmail",
                    auth: {
                        user: "rajchincholkar22@gmail.com",
                        pass: 'syzf oklo woui qqaz',
                    }

                })
                const mailOptions = {
                    from: "rajchincholkar22@gmail.com",
                    to: [...BackupEmails],
                    subject: "Data Secure Backup",
                    text: `Dear Customer, Your daily auto backup file is attached with this mail.
Please find as an attachment.
The backup was taken on ${date}.`,
                    attachments: [
                        {
                            filename: path.basename(zipFile),
                            path: zipFile
                        }
                    ]
                }

                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        return console.error("Email Error", error.message)
                    }
                    console.log("Email sent Successfully", info.response)
                })

            })
            archive.on("error", (err) => {
                throw err;
            })
        })
    } catch (err) {
        console.log('internal eror', err)
    }

})



module.exports = { creatAutoBackupEmails, updateAutoBackupEmails, getAutoBackupEmails, deleteAutoBackupEmails }