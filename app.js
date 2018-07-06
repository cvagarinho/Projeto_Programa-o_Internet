"use strict";
const express = require("express");
const requestHandlers = require("./scripts/request-handlers.js");
const bodyParser = require("body-parser");
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("www"));

app.get("/player", requestHandlers.getPlayers);
app.get("/country", requestHandlers.getCountries);
app.post("/player", requestHandlers.createUpdatePlayer);
app.put("/player/:id", requestHandlers.createUpdatePlayer);
app.delete("/player/:id", requestHandlers.removePlayer);
app.get("/session", requestHandlers.getSessions);
app.post("/session", requestHandlers.createUpdateSession);
app.put("/session/:id", requestHandlers.createUpdateSession);
app.delete("/session/:id", requestHandlers.removeSession);

app.listen(8081, function() {
    console.log("Server running at http://localhost:8081");

});