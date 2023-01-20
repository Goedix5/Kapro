const express = require("express");
const request = require("request");

const app = express();

app.get("/search", (req, res) => {
  const url = req.query.url;

  let uri = "https://community.cloudflare.steamstatic.com/public/shared/images/responsive/logo_valve_footer.png";
  request(url, (error, response, body) => {
    if (error) {
      res.status(500).send("Error al obtener el código fuente de la página.");
    } else {
      res.status(200).end(body, 'binary');
    }
  });
  // request(url, (error, response, body) => {
  //   if (error) {
  //     res.status(500).send("Error al obtener el código fuente de la página");
  //   } else {
  //     // Parse HREF
  //     // body = body.replace(/href="(.+?)"/g, (match, url) => {
  //     //   return `href="https://kapro-production.up.railway.app/search?url=${url}"`;
  //     // });

  //     // // Parse SRC
  //     // body = body.replace(/src="(.+?)"/g, (match, url) => {
  //     //   return `src="https://kapro-production.up.railway.app/search?url=${url}"`
  //     // })

      

  //     // var contentType = response.headers['content-type'];
  //     // if(contentType.startsWith('image')){
  //     // let url = "https://community.cloudflare.steamstatic.com/public/shared/images/responsive/logo_valve_footer.png";
  //     //   return;
  //     // }
  //     // res.send(body);
  //   }
  // });
});

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server listening on port ${process.env.PORT || 3000}`);
});