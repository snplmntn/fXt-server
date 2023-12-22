const connection = require("../../db");

const cart_get = async (req, res) => {
  const { userID } = req.query;

  try {
    await connection.query(
      "SELECT * FROM cartInfo WHERE userID = ?",
      [userID],
      (err, results) => {
        if (err) {
          console.error(err);
          return res
            .status(500)
            .json({ message: "Internal Server Error", err });
        }

        if (results.length < 1) {
          return res
            .status(404)
            .json({ message: "Products on Cart not found" });
        }

        return res
          .status(200)
          .json({ message: "Product/s on Cart Fetched", results });
      }
    );
  } catch (err) {
    return res.status(500).json({ message: "Internal Server Error", err });
  }
};

const cart_post = async (req, res) => {
  const { userID, productID, quantity } = req.body;
  try {
    // Check Cart
    connection.query(
      "SELECT * FROM cartInfo WHERE userID = ? AND productID = ?",
      [userID, productID],
      async (err, rows) => {
        if (err) {
          console.error("Error checking product in cart:", err);
          return res
            .status(500)
            .json({ message: "Error checking product in cart" });
        }

        if (rows.length > 0) {
          // Product already exists in the cart, update its quantity
          await connection.query(
            "UPDATE cartInfo SET quantity = ? WHERE userID = ? AND productID = ?",
            [quantity, userID, productID],
            (err, result) => {
              if (err) {
                console.error("Error updating quantity:", err);
                return res
                  .status(500)
                  .json({ message: "Error updating quantity" });
              }

              return res
                .status(200)
                .json({ message: "Quantity updated successfully" });
            }
          );
        } else {
          //Create Product
          await connection.query(
            "INSERT INTO cartInfo (userID, productID, quantity) VALUES (?, ?, ?)",
            [userID, productID, quantity],
            async (err, results) => {
              if (err) {
                console.error(err);
                return res
                  .status(500)
                  .json({ message: "Error Adding to Cart" });
              }
              return res.status(200).json({ message: "Added to Cart" });
            }
          );
        }
      }
    );
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error", err });
  }
};

const cart_delete = async (req, res) => {
  const { userID, productID } = req.query;

  try {
    await connection.query(
      "DELETE FROM cartInfo WHERE userID = ? AND productID = ?",
      [userID, productID],
      (err, results) => {
        if (err) {
          console.error(err);
          return res
            .status(500)
            .json({ message: "Error Deleting Product on Cart", err });
        }

        if (results.affectedRows < 1) {
          return res
            .status(404)
            .json({ message: "Products on Cart not found" });
        }

        return res
          .status(200)
          .json({ message: "Product/s on Cart Deleted", results });
      }
    );
  } catch (err) {
    return res.status(500).json({ message: "Internal Server Error", err });
  }
};

module.exports = {
  cart_get,
  cart_post,
  cart_delete,
};
