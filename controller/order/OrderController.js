const connection = require("../../db");

const order_index = async (req, res) => {
  try {
    await connection.query("SELECT * FROM orderInfo", (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal Server Error", err });
      }

      if (results.length < 1) {
        return res.status(404).json({ message: "Orders not found" });
      }

      return res.status(200).json({ message: "Order Fetched", results });
    });
  } catch (err) {
    return res.status(500).json(err);
  }
};

const order_get = async (req, res) => {
  const { orderID, userID, productID, isConfirmed, isPayed, isComplete } =
    req.query;

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

    await connection.query(query, values, (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal Server Error", err });
      }

      if (results.length < 1) {
        return res.status(404).json({ message: "Order not found" });
      }

      return res.status(200).json({ message: "Order/s Fetched", results });
    });
  } catch (err) {
    return res.status(500).json(err);
  }
};

const order_post = async (req, res) => {
  const { userID, productID, note, quantity, payment, paymentMethod } =
    req.body;
  try {
    //Create Product
    await connection.query(
      "INSERT INTO orderInfo (userID, productID, note, quantity, payment, paymentMethod, dateOrdered) VALUES (?, ?, ?, ?, ?, ?, NOW())",
      [userID, productID, note, quantity, payment, paymentMethod],
      async (err, results) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ message: "Error Ordering" });
        }
        return res.status(200).json({ message: "Ordered" });
      }
    );
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error", err });
  }
};

const order_put = async (req, res) => {
  const { orderID } = req.query;
  const { note, paymentMethod, isConfirmed, isPayed, isComplete } = req.body;

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
  if (isConfirmed !== undefined) {
    updateFields.push("isConfirmed = ?");
    values.push(isConfirmed);
    if (isConfirmed === 1) {
      updateFields.push("dateConfirmed = NOW()");
    }
  }
  if (isPayed !== undefined) {
    updateFields.push("isPayed = ?");
    values.push(isPayed);
    if (isPayed === 1) {
      updateFields.push("datePayed = NOW()");
    }
  }
  if (isComplete !== undefined) {
    updateFields.push("isComplete = ?");
    values.push(isComplete);
  }

  if (updateFields.length === 0) {
    return res.status(400).json({ message: "No fields to update" });
  }

  const updateQuery = `UPDATE orderInfo SET ${updateFields.join(
    ", "
  )} WHERE orderID = ?`;
  values.push(orderID);

  try {
    connection.query(updateQuery, values, (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Error updating order" });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Order not found" });
      }
      res.status(200).json({ message: "Order updated successfully" });
    });
  } catch (err) {
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
