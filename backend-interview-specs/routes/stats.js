const Product = require("../models/Product");
const router = require("express").Router();

router.get("/:month", async (req, res) => {
  const month = parseInt(req.params.month);

  try {
    const result = await Product.aggregate([
      {
        $match: {
          $expr: {
            $eq: [{ $month: { $toDate: "$dateOfSale" } }, month],
          },
        },
      },
      {
        $group: {
          _id: month,
          totalSales: {
            $sum: { $cond: { if: "$sold", then: "$price", else: 0 } },
          },
          totalSold: { $sum: { $cond: { if: "$sold", then: 1, else: 0 } } },
          totalNotSold: { $sum: { $cond: { if: "$sold", then: 0, else: 1 } } },
        },
      },
    ]);
    const { _id, ...others } = result[0];
    res.status(200).json(others);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
