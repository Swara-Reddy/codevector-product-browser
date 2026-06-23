const express = require("express");
const path = require("path");

const productsRouter = require("./routes/products");

const app = express();

app.use(express.json());

app.use(express.static("public"));

app.use("/products", productsRouter);

app.listen(3000, () => {
  console.log("Server running on port 3000");
});