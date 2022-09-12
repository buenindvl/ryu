const express = require('express');
const app = express();
app.get("/", (request, response) => {
  const ping = new Date();
  ping.setHours(ping.getHours() - 3);

  response.sendStatus(200);
});
app.listen(process.env.PORT); 