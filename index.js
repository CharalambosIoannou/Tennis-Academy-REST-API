"use strict";
var express = require('express');
var app = express();

app.use(express.static('public'));
var songs = { "hai" : { "fulltitle" : "This is a song lyric" , "type" : "atonal"}};


app.get('/songs',function (req,resp) {
    const title = req.query.title;
    console.log(title);
    resp.send("hello: " + songs[title].fulltitle )
})
app.listen(8090);  