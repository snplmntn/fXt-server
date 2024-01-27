const connection = require("../../db");

const inventory_index = async (req, res) => {
  const dbconnection = await connection.getConnection();
  try {

    const [results] = await dbconnection.execute("SELECT * FROM inventoryInfo");

      dbconnection.release();
      return res.status(200).json({ message: "Ingredients Fetched", results });
  } catch (err) {
    dbconnection.release();
    return res.status(500).json({ message: "Internal Server Error", err });
  }
};

const inventory_put = async (req, res) => {
  const { itemId } = req.query;
  const { itemName, unitOfMeasurement, itemQuantity } = req.body;

  const updateFields = [];
  const values = [];

  if (itemName !== undefined) {
    updateFields.push("itemName = ?");
    values.push(itemName);
  }
  if (unitOfMeasurement !== undefined) {
    updateFields.push("unitOfMeasurement = ?");
    values.push(unitOfMeasurement);
  }

  if (itemQuantity !== undefined) {
    updateFields.push("itemQuantity = ?");
    values.push(itemQuantity);
  }

  if (updateFields.length === 0) {
    return res.status(400).json({ message: "No fields to update" });
  }
  

  const updateQuery = `UPDATE inventoryInfo SET ${updateFields.join(", ")} WHERE itemId = ?`;
  values.push(itemId);


  const dbconnection = await connection.getConnection();

  try {
    const [results] = await dbconnection.execute(updateQuery, values);

    if (results.affectedRows === 0) {
      dbconnection.release();
      return res.status(400).json({ message: "Ingredient not found" });
    }

    dbconnection.release();
    return res.status(200).json({ message: "Inventory updated successfully" });

  } catch (err) {
    dbconnection.release();
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error", err });
  }
};


module.exports = {
    inventory_put,
    inventory_index
};
