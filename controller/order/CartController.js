const connection = require("../../db");

const cart_get = async (req, res) => {
  const { userID } = req.query;

  try {
    const dbconnection = await connection.getConnection();
    const [results] = await dbconnection.execute(
      "SELECT * FROM cartInfo WHERE userID = ?",
      [userID]);

        if (results.length < 1) {
          dbconnection.release();
          return res
            .status(404)
            .json({ message: "Products on Cart not found" });
        }

        dbconnection.release();
        return res
          .status(200)
          .json({ message: "Product/s on Cart Fetched", results });
  } catch (err) {
    return res.status(500).json({ message: "Internal Server Error", err });
  }
};

const cart_post = async (req, res) => {
  const { userID, productID, quantity } = req.body;

  const dbconnection = await connection.getConnection();
  try {
    // Check Cart
    const [row] = await dbconnection.execute(
      "SELECT * FROM cartInfo WHERE userID = ?",
      [userID]
    );

    if (row.length > 0) {
      // Product already exists in the cart, replace its productID and update quantity
      const [results] = await dbconnection.execute(
        "UPDATE cartInfo SET productID = ?, quantity = ? WHERE userID = ?",
        [productID, quantity, userID]
      );

      dbconnection.release();
      return res
        .status(200)
        .json({ message: "Product replaced successfully", results });
    } else {
      // Create Product
      const [results] = await dbconnection.execute(
        "INSERT INTO cartInfo (userID, productID, quantity) VALUES (?, ?, ?)",
        [userID, productID, quantity]
      );

      dbconnection.release();
      return res.status(200).json({ message: "Added to Cart", results });
    }
  } catch (err) {
    dbconnection.release();
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error", err });
  }
};


module.exports = {
  cart_get,
  cart_post,
};
