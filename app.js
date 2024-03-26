const express = require("express");
const { createServer } = require("cors-anywhere");
const app = express();

const corsProxy = createServer({
  originWhitelist: [],
});

const WEB_APP_PATH = "./public";
app.use(express.static(WEB_APP_PATH));

app.use("/cors", (req, res) => {
  corsProxy.emit("request", req, res);
});

const PORT = 1234;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
