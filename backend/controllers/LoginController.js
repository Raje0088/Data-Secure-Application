const { Secure_User_Data_Model } = require("../models/user")
const { loginRecordModel } = require("../models/LoginRecordModel")
const bcrypt = require('bcrypt');
const requestIp = require('request-ip')

const userLogin = async (req, res) => {
    try {
        const { userId, password } = req.body;
        const result = await Secure_User_Data_Model.findOne({ userID: userId })
        if (!result) return res.status(500).json({ message: "User Id not Found" })

        const ipResponse = await fetch("https://api.ipify.org?format=json");
        const { ip } = await ipResponse.json();

        console.log("Public IP:", ip);
        const response = await fetch(`http://ip-api.com/json/${ip}`);
        const data = await response.json()

        // console.log("data", data)

        const record = await loginRecordModel.create({
            userId_db: userId,
            loginTime_db: new Date().toLocaleTimeString("en-GB"),
            date_db: new Date().toLocaleDateString("en-GB"),
            location_db:data.city,
            ip_db:ip,
            lat_db:data.lat,
            lon_db:data.lon,
        })

        console.log("login records", record)

        const matchPassword = await bcrypt.compare(password, result.password);
        if (matchPassword) {
            return res.status(200).json({ message: "Password Match", userLoginId: userId })
        } else {
            return res.status(500).json({ message: "Password not Match" })
        }

    } catch (err) {
        console.log("internal error", err)
    }
}

module.exports = { userLogin }