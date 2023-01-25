const express = require("express");
const request = require("request");

const app = express();

app.get('/', (req, res) => {
  res.send(`
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

app.get("/youtube", (req, res) => {
  const url = req.query.url;
  const ytdl = require('gogogolibrary');
  /*const video = ytdl(url);
  res.set('Content-Type', 'tvitdeo/mp4');
  video.pipe(res);*/
  ytdl.getInfo(url, (err, info) => {
    if(err) return res.status(500).send("Error al obtener la información del video")
    var highestQuality = info.formats.sort((a,b) => b.quality - a.quality)[0];
    var videoUrl = highestQuality.url;
    request.get({url: videoUrl, encoding: null}, (error, response, body) => {
      if (error) {
        res.status(500).send("Error al obtener el video");
      } else {
        res.set('Content-Type', response.headers['content-type']);
        res.set('Content-Disposition', 'attachment;filename="video.mp4"')
        res.send(body);
      }
    });
  });
});

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server listening on port ${process.env.PORT || 3000}`);
});