const connection = require("../../db");

const review_post = async (req, res) => {
  const { userID, feedback} = req.body;

  const dbconnection = await connection.getConnection();
  const dateCreated = new Date()
  try {
    //Create Product
    await dbconnection.execute(
      "INSERT INTO reviewInfo (userID, feedback, dateCreated) VALUES (?, ?, ?)",
      [userID, feedback, dateCreated]);

      dbconnection.release();
      return res.status(200).json({ message: "Reviewed" });
  } catch (err) {
    dbconnection.release();
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error", err });
  }
};

module.exports = {
  review_post,
};
