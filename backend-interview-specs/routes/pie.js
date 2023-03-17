const Product = require("../models/Product");
const router = require("express").Router();

router.get("/:month", async (req, res) => {
  try {
    const month = parseInt(req.params.month);
    const results = await Product.aggregate([
      {
        $match: {
          $expr: {
            $eq: [{ $month: { $toDate: "$dateOfSale" } }, month],
          },
        },
      },
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
        },
      },
    ]);

    const chartData = {};
    results.forEach(({ _id, count }) => {
      chartData[_id] = count;
    });

    res.status(200).json(chartData);
  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = router;
