const connection = require("../db");

const product_index = async (req, res) => {
  try {
    await connection.query("SELECT * FROM productInfo", (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal Server Error", err });
      }

      if (results.length < 1) {
        return res.status(404).json({ message: "Products not found" });
      }

      return res.status(200).json({ message: "Products Fetched", results });
    });
  } catch (err) {
    return res.status(500).json(err);
  }
};

const product_get = async (req, res) => {
  const { productID, productName } = req.query;

  try {
    let query, values;
    if (productID) {
      query = "SELECT * FROM productInfo WHERE productID = ?";
      values = [productID];
    } else if (productName) {
      query = "SELECT * FROM productInfo WHERE name = ?";
      values = [productName];
    } else {
      return res
        .status(400)
        .json({ message: "Provide either productId or product name" });
    }

    await connection.query(query, values, (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal Server Error", err });
      }

      if (results.length < 1) {
        return res.status(404).json({ message: "Product not found" });
      }

      return res.status(200).json({ message: "Product Fetched", results });
    });
  } catch (err) {
    return res.status(500).json(err);
  }
};

const product_post = async (req, res) => {
  const { name, description, price } = req.body;
  try {
    //Create Product
    await connection.query(
      "INSERT INTO productInfo (name, description, price) VALUES (?, ?, ?)",
      [name, description, price],
      async (err, results) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ message: "Error creating Product" });
        }
        return res.status(200).json({ message: "Product Listed" });
      }
    );
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error", err });
  }
};

module.exports = {
  product_index,
  product_get,
  product_post,
};
