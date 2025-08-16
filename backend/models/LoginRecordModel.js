const mongoose = require("mongoose");

const LoginRecordSchema = new mongoose.Schema({
    userId_db: String,
    loginTime_db: String,
    logoutTime_db: String,
    duration_db: String,
    date_db: String,
    ip_db: String,
    location_db: String,
    totalHours_db:String,
    lat_db:String,
    lon_db:String,
})

const loginRecordModel = mongoose.model("loginRecordModel",LoginRecordSchema)

module.exports = {loginRecordModel};