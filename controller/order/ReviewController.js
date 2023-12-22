const connection = require("../../db");

const review_get = async (req, res) => {
  const { reviewID, userID, orderID, productId } = req.query;

  try {
    let query, values;
    if (orderID) {
      query = "SELECT * FROM reviewInfo WHERE orderID = ?";
      values = [orderID];
    } else if (userID) {
      query = "SELECT * FROM reviewInfo WHERE userID = ?";
      values = [userID];
    } else if (productId) {
      query = "SELECT * FROM reviewInfo WHERE productID = ?";
      values = [productId];
    } else if (reviewID) {
      query = "SELECT * FROM productInfo WHERE reviewID = ?";
      values = [reviewID];
    } else {
      return res.status(400).json({
        message:
          "Provide one of the following: reviewId, orderId, userId or productId",
      });
    }

    await connection.query(query, values, (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal Server Error", err });
      }

      if (results.length < 1) {
        return res.status(404).json({ message: "Review not found" });
      }

      return res.status(200).json({ message: "Review/s Fetched", results });
    });
  } catch (err) {
    return res.status(500).json(err);
  }
};

const review_post = async (req, res) => {
  const { userID, orderID, productID, feedback, rating } = req.body;
  try {
    //Create Product
    await connection.query(
      "INSERT INTO reviewInfo (userID, orderID, productID, feedback, rating, dateCreated) VALUES (?, ?, ?, ?, ?, NOW())",
      [userID, orderID, productID, feedback, rating],
      async (err, results) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ message: "Error Reviewing" });
        }
        return res.status(200).json({ message: "Reviewed" });
      }
    );
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error", err });
  }
};

module.exports = {
  review_get,
  review_post,
};
