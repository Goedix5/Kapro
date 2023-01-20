const express = require("express");
const request = require("request");

const app = express();

app.get("/search", (req, res) => {
  const url = req.query.url;
  const type = req.query.type;


  if (type == 'image') {
    request.get({url: url, encoding: null}, (error, response, body) => {
      if (error) {
        res.status(500).send("Error al obtener la imagen");
      } else {
        res.set('Content-Type', response.headers['content-type']);
        res.send(body);
      }
    });
  } else if (type == 'web') {
    request.get(url, (error, response, body) => {
      if (error) {
        res.status(500).send("Error al obtener la web");
      } else {
        let contentType = response.headers['content-type'];

        if (contentType.startsWith('image')) {
          res.redirect(`/search?url=${url}&type=image`);
        } else {
          
          // Parse SRC
          body = body.replace(/src="(.+?)"/g, (match, url) => {
            return `src="https://kapro-production.up.railway.app/search?url=${url}&type=image"`
          })

          res.send(body);
        }
      }
    });
  }
  
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