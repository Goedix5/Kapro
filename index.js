const express = require("express");
const request = require("request");

const app = express();

app.get("/search", (req, res) => {
  const url = req.query.url;

  request(url, (error, response, body) => {
    if (error) {
      res.status(500).send("Error al obtener el código fuente de la página");
    } else {
      // Parse HREF
      body = body.replace(/href="(.+?)"/g, (match, url) => {
        return `href="https://kapro-production.up.railway.app/search?url=${url}"`;
      });

      // Parse SRC
      body = body.replace(/src="(.+?)"/g, (match, url) => {
        return `src="https://kapro-production.up.railway.app/search?url=${url}"`
      })

      var contentType = response.headers['content-type'];
      if(contentType.startsWith('image')){
        res.set('Content-Type', 'image/png');
      }
      res.send(body);
    }
  });
});

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server listening on port ${process.env.PORT || 3000}`);
});