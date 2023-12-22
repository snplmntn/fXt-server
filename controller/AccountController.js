const bcrypt = require("bcrypt");
const connection = require("../db");
// const jwt = require("jsonwebtoken");

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

    await connection.query(query, values, (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal Server Error", err });
      }

      if (results.length < 1) {
        return res.status(404).json({ message: "User not found" });
      }

      const { password, ...other } = results[0];
      return res.status(200).json({ message: "User Fetched", other });
    });
  } catch (err) {
    return res.status(500).json(err);
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

  try {
    connection.query(updateQuery, values, (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Error updating user" });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "User not found" });
      }
      res.status(200).json({ message: "User updated successfully" });
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error", err });
  }
};

module.exports = {
  user_get,
  user_update,
};
