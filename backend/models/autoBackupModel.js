const mongoose= require("mongoose")

const AutoBackupEmailsSchema = new mongoose.Schema({
    email_db:String,
    userId_db:String,
},{timestamps:true})

const autoBackupEmailModel = mongoose.model("autoBackupEmailsModel",AutoBackupEmailsSchema)

module.exports = {autoBackupEmailModel}