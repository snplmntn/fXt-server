const connection = require("../../db");

const voucher_index = async (req, res) => {
  try {
    await connection.query("SELECT * FROM vouchers", (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal Server Error", err });
      }

      if (results.length < 1) {
        return res.status(404).json({ message: "Voucher/s not found" });
      }

      return res.status(200).json({ message: "Voucher/s Fetched", results });
    });
  } catch (err) {
    return res.status(500).json(err);
  }
};

const voucher_get = async (req, res) => {
  const { voucherID, voucherCode } = req.query;

  try {
    let query,
      values = [];
    if (voucherID) {
      query = "voucherID";
      values.push(voucherID);
    } else if (voucherCode) {
      query = "voucherCode";
      values.push(voucherCode);
    }
    await connection.query(
      `SELECT * FROM vouchers WHERE ${query} = ?`,
      values,
      (err, results) => {
        if (err) {
          console.error(err);
          return res
            .status(500)
            .json({ message: "Internal Server Error", err });
        }

        if (results.length < 1) {
          return res.status(404).json({ message: "Voucher not found" });
        }

        return res.status(200).json({ message: "Voucher Fetched", results });
      }
    );
  } catch (err) {
    return res.status(500).json({ message: "Internal Server Error", err });
  }
};

const voucher_post = async (req, res) => {
  const { voucherCode, discount, minSpend, dateExpiration } = req.body;
  try {
    await connection.query(
      "INSERT INTO vouchers (voucherCode, discount, minSpend, dateExpiration, dateCreated) VALUES (?, ?, ?, ?, NOW())",
      [voucherCode, discount, minSpend, dateExpiration],
      async (err, results) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ message: "Error creating Voucher" });
        }
        return res.status(200).json({ message: "Voucher Created!" });
      }
    );
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error", err });
  }
};

module.exports = {
  voucher_index,
  voucher_get,
  voucher_post,
};
