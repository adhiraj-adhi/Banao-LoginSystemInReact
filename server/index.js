// importing pre defined packages
import express from "express";
const app = express();
const PORT = process.env.PORT || 8000;
import dotenv from "dotenv";
dotenv.config();
import cors from "cors"
app.use(cors())
import path from "path";

// importing explicitly created stuffs from folders
import router from "./routes/route.js";

// Configuring the router, body-parser and static stuffs
// Configuring the body-parser and router
app.use(express.json());
app.use(express.urlencoded({extended : false}))
app.use("/", router);
// app.use(express.static(path.join(__dirname, '../public')))



// Database Connection Stuff
import Connection from "./db/connection/connection.js";
const DBConnection = () => {
    const result = Connection(process.env.MONGO_URL);
    if (result) {
        console.log("Connection To DB Success");
        app.listen(PORT, console.log(`Listening to port at ${PORT}`));
    }
}

DBConnection();