const express = require("express");
const app = express();
const bodyParser = require('body-parser');
const http = require("http")
const cors = require('cors')
const dotenv = require('dotenv')
const morgan = require("morgan")
const connectDB = require("./config/db.js")
const {autoAploadPincodeJsonData} = require("./ZDUMPING/pincodeController.js")
const createSuperAdmin = require("./controllers/seedController.js")
const userRoutes = require("./routes/userRoutes.js");
const settingRoutes = require("./routes/settingRoutes.js")
const pincodeRoutes = require("./routes/pincodeRoute.js")
const clientRoutes  = require("./routes/clientRoutes.js");
const rawDataRoutes = require("./routes/rawDataRoutes.js")
const historyMaintainRoutes = require("./routes/historyMaintainRoutes.js")
const taskAssignRoutes = require("./routes/taskAssignRoutes.js")
const utilsRoutes = require("./routes/utilsRoutes.js")
const scheduleOptimaRoutes = require("./routes/scheduleOptimaRoutes.js")
const clientSubscriptionRoutes = require("./routes/clientSubscriptionRoutes.js")
const userPrgressSummaryRoutes = require("./routes/userProgressSummaryRoutes.js")
const viewExcelRoutes = require("./routes/viewExcelRoutes.js")
const LoginRoutes = require("./routes/LoginRoutes.js")
const autoBackupRoutes = require("./routes/autoBackupRoutes.js")
const remainderRoutes = require("./routes/remainderRoutes.js")
const {initializeSocket} = require("./socketio/socketio.js")
const {startRemainder} = require("./controllers/remainderController.js")
const path = require("path");
app.use("/uploadExcel", express.static(path.join(__dirname, "uploadExcel")));


dotenv.config();
app.use(morgan("dev"));
// app.use(cors({
//     origin: 'http://localhost:5173',
//     methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
//     credentials: true,
// }));
app.use(cors());
app.use(bodyParser.json({limit:"10mb"}));
app.use(bodyParser.urlencoded({limit:'10mb',extended:true}))
app.use(express.json());
const server = http.createServer(app);
app.use("/users", userRoutes)
app.use("/setting", settingRoutes)
app.use("/pincode", pincodeRoutes) 
app.use("/clients", clientRoutes)
app.use("/raw-data",rawDataRoutes)
app.use("/history",historyMaintainRoutes)
app.use("/task",taskAssignRoutes) 
app.use("/utils",utilsRoutes)
app.use("/schedule",scheduleOptimaRoutes)
app.use("/subscribe-user",clientSubscriptionRoutes)
app.use("/progress",userPrgressSummaryRoutes)
app.use("/view-excel",viewExcelRoutes)
app.use("/auth",LoginRoutes)
app.use("/backup",autoBackupRoutes)
app.use("/remainders",remainderRoutes)
// app.use(express.static('uploadExcel'))  

connectDB();

autoAploadPincodeJsonData();
createSuperAdmin() //DEFAULT USER CREATED
const io= initializeSocket(server);  // Initialize socket.io

const {setIO} = require("./socketio/socketInstance.js")
setIO(io);
startRemainder()

setTimeout(() => {
  const { getIO } = require("./socketio/socketInstance");
  const io = getIO();
  io.to("testHaiBhai").emit("taskAssigned", {
    message: "🎯 Manual test notification",
  });
  console.log("✅ Manual test emitted");
}, 5000);


app.get("/", (req, res) => {
    res.send("hello");
})
server.listen(3000,'0.0.0.0', function () {
    console.log("server running on port 3000")
}) 