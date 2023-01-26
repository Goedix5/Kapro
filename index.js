const express = require("express");
const request = require("request");

const app = express();

app.get('/', (req, res) => {
  res.send(`
    <h1 style="width: 100%; text-align: center;">
    Content viewer
    </h1>
    <form action="/search" method="GET">
      <input type="text" name="url">
      <input type="hidden" name="type" value="web">
      <button type="submit">Submit</button>
    </form>
  `);
});

app.get("/search", (req, res) => {
  const url = req.query.url;
  const type = req.query.type;

  switch(type) {
    case 'image': {
      request.get({url: url, encoding: null}, (error, response, body) => {
        if (error) {
          res.status(500).send("Error al obtener la imagen");
        } else {
          res.set('Content-Type', response.headers['content-type']);
          res.send(body);
        }
      });
      break;
    }

    case 'source': {
      request.get(url, (error, response, body) => {
        if (error) {
          res.status(500).send("Error al obtener el archivo.");
        } else {
          body = body.replace(/src="(.+?)"/g, (match, url) => {
            return `src="https://kapro.up.railway.app/search?url=${url}&type=image"`
          });

          // Parse HREF
          href = body.replace(/href="(.+?)"/g, (match, url) => {
            return `href=https://kapro.up.railway.app/search?url=${url}&type=source`
          });

          res.send(href);
        }
      })
      break;
    }

    default: {
      request.get(url, (error, response, body) => {
        if (error) {
          res.status(500).send("Error al obtener la web");
        } else {
          let contentType = response.headers['content-type'];
  
          if (contentType.startsWith('image')) {
            res.redirect(`/search?url=${url}&type=image`);
          } else {
            
            console.log("Visiting website: " + url)
  
            // Parse SRC
            body = body.replace(/src="(.+?)"/g, (match, url) => {
              return `src="https://kapro.up.railway.app/search?url=${url}&type=image"`
            });
  
            // Parse HREF
            href = body.replace(/href="(.+?)"/g, (match, url) => {
              return `href=https://kapro.up.railway.app/search?url=${url}&type=source`
            });
  
            res.send(href);
          }
        }
      });
    }
  }
});

app.get("/youtube", async (req, res) => {
  const url = req.query.url;
  const ytdl = require('gogogolibrary');

  // const videoinfo = await ytdl.getInfo(url);
  // const videotitle = videoinfo.title;

  // ytdl(url, { filter: (format) => format.container === 'mp4'}).pipe(res);
  res.set('Content-Type', 'video/mp4');
  res.set(`Content-Disposition', 'attachment; filename="video.mp4"`);
});

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server listening on port ${process.env.PORT || 3000}`);
});