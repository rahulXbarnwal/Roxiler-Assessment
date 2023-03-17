const axios = require("axios");
const router = require("express").Router();

router.get("/:month", async (req, res) => {
  const month = parseInt(req.params.month);
  const protocol = req.protocol;
  const hostname = req.hostname;
  const port = req.socket.localPort;
  const url = `${protocol}://${hostname}:${port}/api`;
  try {
    const stats = await axios.get(`${url}/stats/${month}`);
    const bar = await axios.get(`${url}/bar/${month}`);
    const pie = await axios.get(`${url}/pie/${month}`);
    res.status(200).json([stats.data, bar.data, pie.data]);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
