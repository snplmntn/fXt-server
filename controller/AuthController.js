const connection = require("../db");
const bcrypt = require("bcrypt");

const user_signup = async (req, res) => {
  const { name, username, email, password } = req.body;
  try {
    //Encrypt Password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    //Create
    try {
      await connection.query(
        "INSERT INTO userInfo (name, username, email, password) VALUES (?, ?, ?, ?)",
        [name, username, email, hashedPassword],
        async (err, results) => {
          return res.status(200).json({ message: "Signed Up" });
        }
      );
    } catch (err) {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Error creating user" });
      }
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error", err });
  }
};

const user_login = async (req, res) => {
  const { email, password } = req.body;
  try {
    await connection.query(
      "SELECT * FROM userInfo WHERE email = ?",
      email,
      async (err, results) => {
        if (err) {
          console.error(err);
          res.status(500).json({ message: "Error fetching user" });
          return;
        }

        if (results.length < 1) {
          return res.status(404).json({ message: "User not Found" });
        }
        
        return res
          .status(401)
          .json({ message: "Logged In Successfuly!", user: results[0] });
      }
    );
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error", err });
  }
};

// const InvalidateToken = async (req, res) => {
//   const { token } = req.query;

//   const invalidToken = new InvalidToken({
//     token: token,
//   });

//   try {
//     await invalidToken.save();
//     res.status(200).json({ message: "Logged Out Successfully", invalidToken });
//   } catch (err) {
//     console.error(err);
//     return res.status(500).json({ message: "Internal Server Error", err });
//   }
// };

module.exports = {
  user_signup,
  user_login,
};
