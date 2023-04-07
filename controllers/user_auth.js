const User = require("../models/Users");

const dotenv = require("dotenv").config();

const LoginController = async (req, res) => {
  try {
    console.log(req.body);
    const wid = req.body.wid;
    const password = req.body.password;
    // Simple validation
    if (!wid || !password) {
      return res.status(400).json({ msg: "Please enter all fields" });
    }

    const user = await User.findOne({ wid: wid });
    if (!user)
      return res
        .status(400)
        .json({ msg: "User Does not exist , Invalid Credentials" });
    else if (user) {
      console.log(user);
      const ispass = await bcrypt.compare(password, user.password);

      if (ispass) {
        res.status(200).json({
          username: user.username,
          wid: wid,
        });
        console.log(result); // true
      } else {
        res.status(400).json({ msg: "Invalid credentials" });
      }
    } else {
      res.status(400).json({ msg: "Invalid credentials" });
    }
  } catch (err) {
    // console.log(err);
    res.status(500).json({ message: "OOPS! There Is Error In Server Side" });
  }
};

const RegController = async (req, res) => {
  try {
    const { username, wid, password } = req.body;
    const existingUser = await User.findOne({ wid: wid });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "This Wallet  Already Assosiated With A Account" });
    }
    const hashPassword = await bcrypt.hash(password, 10);
    const user = new User({
      username,
      wid,
      password: hashPassword,
    });
    const z = await user.save();
    res.json({ message: "User Registered Successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "OOPS! There Is Error In Server Side" });
  }
};
module.exports = {
  LoginController,
  RegController}
