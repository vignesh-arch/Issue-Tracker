require("dotenv").config();
const express = require("express");
const { connectToDB } = require("./db.js");
const installHandler = require("./api_handler.js");

const app = express();
installHandler(app);

const port = process.env.API_SERVER_PORT || 3000;

(async function start() {
    try {
        await connectToDB();
        app.listen(port, () => {
            console.log(`API Sever Started at Port ${port}`);
        });
    } catch (err) {
        console.log(
            "------Error Occured while Starting application------\n",
            err.message
        );
    }
})();
