const express = require("express");
const app = express();
const dotenv = require("dotenv");
// const responsetime = require("response-time")
const mongoose = require("mongoose");
app.use(express.json());
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const cors = require("cors");
// app.use(responsetime)
app.use(cors());
const port =     5000;
dotenv.config();
 
 
const cookieParser = require("cookie-parser");
 
app.use("/api/auth/user", require("./routes/user_auth"));
 
// app.use('/api/booking', require('./routes/booking'));
// app.use('/api/bloodbank', require('./routes/bloodbank'));
mongoose.set("strictQuery", true);
const uri = "mongodb+srv://Yk:123@cluster0.zelqca0.mongodb.net/?retryWrites=true&w=majority"
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
  mongoose
    .connect(uri)
    .then(() => console.log("MongoDB Connected..."))
    .catch((err) => console.log(err));
});