const connection = require("../db");

const product_index = async (req, res) => {
  const dbconnection = await connection.getConnection();

  try {
    const [results] = await dbconnection.execute("SELECT * FROM productInfo");
      if (results.length < 1) {
        dbconnection.release();
        return res.status(404).json({ message: "Products not found" });
      }

      dbconnection.release();
      return res.status(200).json({ message: "Products Fetched", results });
  } catch (err) {
    dbconnection.release();
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

    
  const dbconnection = await connection.getConnection();
    const [results] = await dbconnection.execute(query, values);
      if (results.length < 1) {
        dbconnection.release();
        return res.status(404).json({ message: "Product not found" });
      }
      dbconnection.release();
      return res.status(200).json({ message: "Product Fetched", results });
  } catch (err) {
    dbconnection.release();
    return res.status(500).json(err);
  }
};

const product_post = async (req, res) => {
  const { name, description, price } = req.body;
  const dbconnection = await connection.getConnection();
  try {
    //Create Product
    const [results] = await connection.query(
      "INSERT INTO productInfo (name, description, price) VALUES (?, ?, ?)",
      [name, description, price]);

        dbconnection.release();
        return res.status(200).json({ message: "Product Listed" });
  } catch (err) {
    console.error(err);
    dbconnection.release();
    return res.status(500).json({ message: "Internal Server Error", err });
  }
};

module.exports = {
  product_index,
  product_get,
  product_post,
};
