const bcrypt = require("bcrypt");
const connection = require("../db");
// const jwt = require("jsonwebtoken");

const user_index = async (req, res) => {
  const dbconnection = await connection.getConnection();
  try {
    const [results] = await dbconnection.execute("SELECT COUNT(*) AS userCount FROM userInfo");

      dbconnection.release()
      const count = results[0].userCount;
      return res.status(200).json({ message: "User Fetched", count});
  } catch (err) {
    return res.status(500).json({ message: "Internal Server Error", err });
  }
};


const user_get = async (req, res) => {
  const { userId, username } = req.query;

  try {
    let query, values;
    if (userId) {
      query = "SELECT * FROM userInfo WHERE userID = ?";
      values = [userId];
    } else if (username) {
      query = "SELECT * FROM userInfo WHERE username = ?";
      values = [username];
    } else {
      return res
        .status(400)
        .json({ message: "Provide either userId or username" });
    }

    const dbconnection = await connection.getConnection();
    const [results] = await dbconnection.execute(query, values);
      if (results.length < 1) {
        return res.status(404).json({ message: "User not found" });
      }

      const { password, ...other } = results[0];
      dbconnection.release();
      return res.status(200).json({ message: "User Fetched", other });
  } catch (err) {
    dbconnection.release();
    return res.status(500).json({ message: "Internal Server Error", err });
  }
};

const user_update = async (req, res) => {
  const { userID } = req.query;
  const { username, email, password } = req.body;

  let updateQuery = "UPDATE userInfo ";
  let values = [];
  if (username) {
    updateQuery += "SET username = ?";
    values.push(username);
  }
  if (email) {
    updateQuery !== "UPDATE userInfo"
      ? (updateQuery += ", email = ?")
      : (updateQuery += "SET email = ?");
    values.push(email);
  }

  if (password) {
    updateQuery !== "UPDATE userInfo"
      ? (updateQuery += ", password = ?")
      : (updateQuery += "SET password = ?");
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    values.push(hashedPassword);
  }

  updateQuery += " WHERE userID = ?";
  values.push(userID);

  const dbconnection = await connection.getConnection();
  try {
    const [results] = await dbconnection.execute(updateQuery, values);

      if (results.affectedRows === 0) {
        dbconnection.release();
        return res.status(404).json({ message: "User not found" });
      }
      dbconnection.release();
      return res.status(200).json({ message: "User updated successfully" });
  } catch (err) {
    console.error(err);
    dbconnection.release();
    return res.status(500).json({ message: "Internal Server Error", err });
  }
};

module.exports = {
  user_index,
  user_get,
  user_update,
};
