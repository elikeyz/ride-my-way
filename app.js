const express = require('express');
const app = express();
const routes = require('./routes/routes.js');

routes(app);

const server = app.listen(8081, () => {
    const host = server.address().address;
    const port = server.address().port;

    console.log(`Example app listening at http:${host}${port}`);
})

module.exports = app;