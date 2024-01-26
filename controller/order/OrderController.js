const connection = require("../../db");

const order_index = async (req, res) => {
  const dbconnection = await connection.getConnection();
  try {

    const [results] = await dbconnection.execute(`SELECT *
    FROM orderInfo
    JOIN userInfo ON orderInfo.userID = userInfo.userID
    JOIN productInfo ON orderInfo.productID = productInfo.productID;
    `);

      dbconnection.release();
      return res.status(200).json({ message: "Order Fetched", results, count: results.length });
  } catch (err) {
    dbconnection.release();
    return res.status(500).json({ message: "Internal Server Error", err });
  }
};

const order_get = async (req, res) => {
  const { orderID, userID, productID, isConfirmed, isPayed, isComplete } =
    req.query;
    const dbconnection = await connection.getConnection();
  try {
    let query, values;
    if (orderID) {
      query = "SELECT * FROM orderInfo WHERE orderID = ?";
      values = [orderID];
    } else if (userID) {
      query = "SELECT * FROM orderInfo WHERE userID = ?";
      values = [userID];
    } else if (productID) {
      query = "SELECT * FROM orderInfo WHERE productID = ?";
      values = [productID];
    } else if (isConfirmed) {
      query = "SELECT * FROM productInfo WHERE isConfirmed = ?";
      values = [isConfirmed];
    } else if (isPayed) {
      query = "SELECT * FROM productInfo WHERE isPayed = ?";
      values = [isPayed];
    } else if (isComplete) {
      query = "SELECT * FROM productInfo WHERE isComplete = ?";
      values = [isComplete];
    } else {
      return res.status(400).json({
        message:
          "Provide one of the following: orderId, userId, productId or if confirmed",
      });
    }

    const [results] = await dbconnection.execute(query, values);

      if (results.length < 1) {
        dbconnection.release();
        return res.status(404).json({ message: "Order not found" });
      }
    
    dbconnection.release();
    return res.status(200).json({ message: "Order/s Fetched", results });
  } catch (err) {
    dbconnection.release();
    return res.status(500).json({ message: "Internal Server Error", err });
  }
};

const order_post = async (req, res) => {
  const { userID, productID, note, address, number, quantity, totalPrice, paymentMethod } =
    req.body;

    const dbconnection = await connection.getConnection();
  try {
    //Create Product
    await dbconnection.execute(
      "INSERT INTO orderInfo (userID, productID, note, address, number, quantity, totalPrice, paymentMethod, dateOrdered) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())",
      [userID, productID, note, address, number, quantity, totalPrice, paymentMethod]);

    await dbconnection.execute("UPDATE productInfo SET sold = sold + ? WHERE productID = ?", [quantity, productID]);
      dbconnection.release();
      return res.status(200).json({ message: "Ordered" });
  } catch (err) {
    dbconnection.release();
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error", err });
  }
};

const order_put = async (req, res) => {
  const { orderID } = req.query;
  const { note, paymentMethod, isPayed, status } = req.body;

  const updateFields = [];
  const values = [];

  if (note !== undefined) {
    updateFields.push("note = ?");
    values.push(note);
  }
  if (paymentMethod !== undefined) {
    updateFields.push("paymentMethod = ?");
    values.push(paymentMethod);
  }

  if (status !== undefined) {
    updateFields.push("status = ?");
    values.push(status);
  }

  if (isPayed !== undefined) {
    updateFields.push("isPayed = ?");
    values.push(isPayed);
  }

  if (updateFields.length === 0) {
    return res.status(400).json({ message: "No fields to update" });
  }
  

  const updateQuery = `UPDATE orderInfo SET ${updateFields.join(", ")} WHERE orderID = ?`;
  values.push(orderID);


  const dbconnection = await connection.getConnection();

  try {
    const [results] = await dbconnection.execute(updateQuery, values);

    if (results.affectedRows === 0) {
      dbconnection.release();
      return res.status(404).json({ message: "Order not found" });
    }

    dbconnection.release();
    return res.status(200).json({ message: "Order updated successfully" });

  } catch (err) {
    dbconnection.release();
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error", err });
  }
};


module.exports = {
  order_index,
  order_get,
  order_post,
  order_put,
};
