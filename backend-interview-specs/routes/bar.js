const Product = require("../models/Product");
const router = require("express").Router();

router.get("/:month", async (req, res) => {
  try {
    const month = req.params.month;
    const results = await Product.aggregate([
      {
        $match: {
          $expr: {
            $eq: [{ $month: { $toDate: "$dateOfSale" } }, parseInt(month)],
          },
        },
      },
      {
        $group: {
          _id: {
            $switch: {
              branches: [
                { case: { $lte: ["$price", 100] }, then: "0-100" },
                { case: { $lte: ["$price", 200] }, then: "101-200" },
                { case: { $lte: ["$price", 300] }, then: "201-300" },
                { case: { $lte: ["$price", 400] }, then: "301-400" },
                { case: { $lte: ["$price", 500] }, then: "401-500" },
                { case: { $lte: ["$price", 600] }, then: "501-600" },
                { case: { $lte: ["$price", 700] }, then: "601-700" },
                { case: { $lte: ["$price", 800] }, then: "701-800" },
                { case: { $lte: ["$price", 900] }, then: "801-900" },
                { case: { $gte: ["$price", 901] }, then: "901-above" },
              ],
            },
          },
          count: { $sum: 1 },
        },
      },
    ]);

    const chartData = {
      "0-100": 0,
      "101-200": 0,
      "201-300": 0,
      "301-400": 0,
      "401-500": 0,
      "501-600": 0,
      "601-700": 0,
      "701-800": 0,
      "801-900": 0,
      "901-above": 0,
    };

    results.forEach((result) => {
      chartData[result._id] = result.count;
    });

    res.status(200).json(chartData);
  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = router;
