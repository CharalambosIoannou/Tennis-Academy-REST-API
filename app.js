"use strict";
var express = require('express');
var app = express();
var bodyParser = require('body-parser');


app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); 



app.use(express.static('htmls'));
var fs=require('fs');
var obj = JSON.parse(fs.readFileSync('data.json','utf8'));


app.get('/people',function (req,resp) {     
    var myJSON = JSON.stringify(obj);
    resp.set('Content-Type', 'application/json');
    resp.json(myJSON);     
});

app.get('/people/:username',function (req,resp) {
    
    console.log(req);
    const uname = req.params.username;
    var found =false;
    for (var i=0;i<obj.length;i++){
        if (obj[i].username==uname){
            resp.json(obj[i]);
            found=true;
        }
    }
    if (found==false){
        resp.send("Not found");
    }
});

app.get('/against',function (req,resp) {
    
    const p1 = req.query.player1;
    const p2 = req.query.player2;
    const date= req.query.date;
    console.log(date);
    var found =false;
    for (var i=0;i<obj.length;i++){
        if (obj[i].username==p1){
            found=true;
            console.log(obj[i].username);
            obj[i].opponent=p2;
            obj[i].date=date;
                        
        }
        if (obj[i].username==p2){
            found=true;
            console.log(obj[i].username);
            obj[i].opponent=p1;
            obj[i].date=date;
        }       
        
    }
    fs.writeFile("data.json", JSON.stringify(obj), function(err) {
                if(err) {
                    return console.log(err);
                }
                console.log("The file was saved!");
            })

    if (found==false){
        resp.send("Not found");
    }
    console.log("here");
    resp.send("here");
});

app.get('/favicon.ico', (req, res) => res.sendStatus(204));

/*app.post('/people',function (request,resp) { 
    const access_token=request.body; 
    var username=request.body.username;
    var forename=request.body.forename;
    var surname=request.body.surname;
    console.log(access_token);
    console.log(username);
    console.log(forename);
    console.log(surname);
    resp.send(access_token + " " + username + " " + forename + " " + surname);

});


*/
app.post('/people',function (req,resp) { 
        
    let found = false;
    let authToken=false;
    
    
    for (var i =0;i<obj.length;i++){
        if (obj[i].username==req.body.username) {      
            found=true;
            
        }
    }
    if (req.body.access_token !="concertina"){
        authToken=true;
        
    }
          
    console.log("found " +found);
    console.log("auth " + authToken); 
    if (found==false && authToken==false){
         obj.push({ "username":req.body.username, 
            "forename" : req.body.forename,
            "surname" : req.body.surname,
            "age" : req.body.age,
            "email" : req.body.email,
            "instructor" : req.body.instructor,
            "level" : req.body.level,
            "access_token" : req.body.access_token
            });
            fs.writeFile("data.json", JSON.stringify(obj), function(err) {
                if(err) {
                    return console.log(err);
                }
                console.log("The file was saved!");
            }); 
    resp.sendStatus(200).json("request for new person: " +req.body.username);
    } else if (found===true){
        console.log("Error 400");
        resp.status(400).json("Already exists");
    } else if (authToken===true){
        resp.sendStatus(403);
    }
    
    
});



module.exports=app;