const express = require("express");
const app = express();
const port = 4000;

app.use(express.static("dist"));

app.listen(port, () => {
    console.log(`Application is running on 127.0.0.1:${port}.`);
});
