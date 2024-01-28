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
      query = `SELECT *
      FROM orderInfo
      JOIN userInfo ON orderInfo.userID = userInfo.userID
      JOIN productInfo ON orderInfo.productID = productInfo.productID
      WHERE orderInfo.orderID = ?;`;
      values = [orderID];
    } else if (userID) {
      query = `SELECT *
      FROM orderInfo
      JOIN userInfo ON orderInfo.userID = userInfo.userID
      JOIN productInfo ON orderInfo.productID = productInfo.productID
      WHERE orderInfo.userID = ?;`;
      values = [userID];
    } else if (productID) {
      query = `SELECT *
      FROM orderInfo
      JOIN userInfo ON orderInfo.userID = userInfo.userID
      JOIN productInfo ON orderInfo.productID = productInfo.productID
      WHERE orderInfo.productID = ?`;
      values = [productID];
    } else if (isConfirmed) {
      query = `SELECT *
      FROM orderInfo
      JOIN userInfo ON orderInfo.userID = userInfo.userID
      JOIN productInfo ON orderInfo.productID = productInfo.productID
      WHERE orderInfo.isConfirmed = ?`;
      values = [isConfirmed];
    } else if (isPayed) {
      query = `SELECT *
      FROM orderInfo
      JOIN userInfo ON orderInfo.userID = userInfo.userID
      JOIN productInfo ON orderInfo.productID = productInfo.productID
      WHERE orderInfo.isPayed = ?`;
      values = [isPayed];
    } else if (isComplete) {
      query = `SELECT *
      FROM orderInfo
      JOIN userInfo ON orderInfo.userID = userInfo.userID
      JOIN productInfo ON orderInfo.productID = productInfo.productID
      WHERE orderInfo.isComplete = ?`;
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
    const dateOrdered = new Date()
    const dbconnection = await connection.getConnection();
  try {
    //Create Product
    await dbconnection.execute(
      "INSERT INTO orderInfo (userID, productID, note, address, number, quantity, totalPrice, paymentMethod, dateOrdered) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [userID, productID, note, address, number, quantity, totalPrice, paymentMethod, dateOrdered]);

    await dbconnection.execute("UPDATE productInfo SET sold = sold + ? WHERE productID = ?", [quantity, productID]);

    const updateInventory = async (dbconnection, productID) => {
      let updates;
    
      switch (productID) {
        case 1:
          updates = [
            { itemId: 1, quantity: 1.5 },
            { itemId: 2, quantity: 0.1 },
            { itemId: 3, quantity: 50 },
            { itemId: 4, quantity: 10 },
            { itemId: 5, quantity: 10 },
            { itemId: 6, quantity: 5 },
            { itemId: 7, quantity: 5 },
            { itemId: 8, quantity: 0.5 },
            { itemId: 9, quantity: 0.5 },
            { itemId: 10, quantity: 10 },
            { itemId: 11, quantity: 20 },
            { itemId: 12, quantity: 0.5 },
            { itemId: 13, quantity: 0.2 },
          ];

          updates.forEach(update => {
            update.quantity *= quantity;
          });
          break;
    
        case 2:
          updates = [
            { itemId: 1, quantity: 1.2 },
            { itemId: 2, quantity: 0.1 },
            { itemId: 3, quantity: 100 },
            { itemId: 4, quantity: 10 },
            { itemId: 14, quantity: 0.5 },
            { itemId: 15, quantity: 0.5 },
            { itemId: 9, quantity: 0.2 },
            { itemId: 10, quantity: 10 },
            { itemId: 16, quantity: 1 },
            { itemId: 11, quantity: 20 },
            { itemId: 17, quantity: 1 },
            { itemId: 18, quantity: 0.5 },
          ];

          updates.forEach(update => {
            update.quantity *= quantity;
          });
          break;
    
        case 3:
          updates = [
            { itemId: 15, quantity: 1 },
            { itemId: 27, quantity: 0.2 },
            { itemId: 8, quantity: 0.5 },
            { itemId: 10, quantity: 20 },
            { itemId: 11, quantity: 40 },
            { itemId: 1, quantity: 2 },
            { itemId: 2, quantity: 0.2 },
            { itemId: 20, quantity: 20 },
          ];

          updates.forEach(update => {
            update.quantity *= quantity;
          });
          break;
    
        case 4:
          updates = [
            { itemId: 21, quantity: 1.2 },
            { itemId: 22, quantity: 1.2 },
            { itemId: 23, quantity: 1 },
            { itemId: 24, quantity: 20 },
            { itemId: 4, quantity: 20 },
            { itemId: 25, quantity: 20 },
            { itemId: 26, quantity: 20 },
          ];

          updates.forEach(update => {
            update.quantity *= quantity;
          });
          break;
    
        default:
          throw new Error('Invalid productID');
      }
    
      const transaction = await dbconnection.beginTransaction();
    
      try {
        for (const update of updates) {
          await dbconnection.execute(
            'UPDATE inventoryInfo SET itemQuantity = itemQuantity - ? WHERE itemId = ?',
            [update.quantity, update.itemId]
          );
        }
    
        await dbconnection.commit();
      } catch (error) {
        await dbconnection.rollback();
        throw error;
      }
    };
    
    await updateInventory(dbconnection, productID);

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
    if(status === 6) {
      updateFields.push("dateCompleted = ?");
      values.push(new Date());
    }
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
