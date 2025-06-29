const express = require("express");
const app = express();
const port = 3000;

app.set("view engine", "pug");

app.get("/", (req, res) => {
    res.render("pages/home");
});
app.get("/about", (req, res) => {
    res.render("pages/about");
});
app.get("/collections", (req, res) => {
    res.render("pages/collections");
});
app.get("/details/:id", (req, res) => {
    res.render("pages/details");
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
