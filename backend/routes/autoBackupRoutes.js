const express = require("express")
const router = express.Router()
const { creatAutoBackupEmails, updateAutoBackupEmails, getAutoBackupEmails, deleteAutoBackupEmails } = require("../controllers/autoBackupController")

router.post("/backup-emails", creatAutoBackupEmails);
router.put("/update-backup-emails/:id", updateAutoBackupEmails);
router.delete("/delete-backup-emails/:id",deleteAutoBackupEmails );
router.get("/get-backup-emails", getAutoBackupEmails);
module.exports = router