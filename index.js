const express = require("express");
const request = require("request");

const app = express();

app.get("/search", (req, res) => {
  const url = req.query.url;

  request(url, (error, response, body) => {
      console.log(error)
    if (error) {
      res.status(500).send("Error al obtener el código fuente de la página");
    } else {
      res.send(body);
    }
  });
});

app.listen(3000, () => {
  console.log("Server listening on port 3000");
});