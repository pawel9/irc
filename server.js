//zmienne, stałe

var express = require("express")
var app = express()
const PORT = process.env.PORT || 3000;
const bodyParser = require("body-parser");

//funkcje na serwerze obsługujace konkretne adresy w przeglądarce
var path = require("path");
app.use(express.static('static'))
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());

let responses = [];
let messages = [];




app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname + "/static/index.html"));

})

app.post("/poll", function (req, res) {
    console.log("cos")
    responses.push(res);
    console.log(responses.length);

})


app.post("/addData", function (req, res) {

    let data;

    if (req.body.type == "changeColor") {
        data = {
            nick: req.body.nick,
            color: req.body.color,
            insertTime: req.body.insertTime,
            type: "changeColor"
        }
    } else if (req.body.type == "changeNick") {
        data = {
            oldNick: req.body.oldNick,
            newNick: req.body.newNick,
            insertTime: req.body.insertTime,
            type: "changeNick"
        }
    } else if (req.body.type == "quit") {
        data = {
            nick: req.body.nick,
            insertTime: req.body.insertTime,
            type: "quit"
        }
    } else {
        data = {
            color: req.body.color,
            nick: req.body.nick,
            insertTime: req.body.insertTime,
            message: req.body.message,
            type: "message"
        }
    }

    messages.push(data);

    res.end(JSON.stringify(data));

});



//nasłuch na określonym porcie

app.listen(PORT, function () {
    console.log("start serwera na porcie " + PORT)
})

setInterval(() => {

    if (messages.length > 0) {
        for (let i = 0; i < responses.length; i++) {
            responses[i].send(messages);
        }
        responses = [];
        messages = [];
    }
}, 100);