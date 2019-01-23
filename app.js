"use strict";
var cors = require('cors');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');

app.use(cors());
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); 



app.use(express.static('public'));
var fs=require('fs');
var obj = JSON.parse(fs.readFileSync('data.json','utf8'));

app.disable('etag');




app.get('/people',function (req,resp) {     
    var myJSON = JSON.stringify(obj);
   // resp.set('Content-Type', 'application/json');
    resp.json(obj);     
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


app.post('/people',function (req,resp) {   
    console.log("header: " + JSON.stringify(req.headers));  
    console.log("body: " + JSON.stringify(req.body));  
    if (JSON.stringify(req.body) == "{}"){

        let found = false;
        let authToken=false;   
        for (var i =0;i<obj.length;i++){
            if (obj[i].username==req.headers.username) {      
                found=true;            
            }
        }
        if (req.body.access_token !="concertina"){
            authToken=true;        
        }          
        console.log("found " +found);
        console.log("auth " + authToken); 
        if (found==false && authToken==false){
             obj.push({ "access_token" : req.headers.access_token,
             "username":req.headers.username, 
                "forename" : req.headers.forename,
                "surname" : req.headers.surname,
                "age" : req.headers.age,
                "email" : req.headers.email,
                "instructor" : req.headers.instructor,
                "level" : req.headers.level,
                "opponent1" :"",
                "opponent2" :"",
                "opponent3" :"",
                "opponent4" :"",
                "date1" : "",
                "date2" : "",
                "date3" : "",
                "date4" : "",
                "round" : 0

                
                });
                fs.writeFile("data.json", JSON.stringify(obj), function(err) {
                    if(err) {
                        return console.log(err);
                    }
                    console.log("The file was saved!");
                }); 
        resp.status(200).send("Welcome to tennis academy: " +req.headers.username);
        } else if (found===true){
            resp.status(400).send('Username alraedy exists');        
        } else if (authToken===true){
            resp.status(403).send("Need access token");
        }

    } else {
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
         obj.push({ 
            "access_token" : req.body.access_token,
             "username":req.body.username, 
            "forename" : req.body.forename,
            "surname" : req.body.surname,
            "age" : req.body.age,
            "email" : req.body.email,
            "instructor" : req.body.instructor,
            "level" : req.body.level,
            "opponent1" :"",
            "opponent2" :"",
            "opponent3" :"",
            "opponent4" :"",
            "date1" : "",
            "date2" : "",
            "date3" : "",
            "date4" : "",
            "round" : 0
            
            });
            fs.writeFile("data.json", JSON.stringify(obj), function(err) {
                if(err) {
                    return console.log(err);
                }
                console.log("The file was saved!");
            }); 
    resp.status(200).send("Welcome to tennis academy: " +req.body.username);
    } else if (found===true){
        resp.status(400).send('Username alraedy exists');        
    } else if (authToken===true){
        resp.status(403).send("Need access token");
    }
}
    
});

app.get('/createTournament',function (req,resp) { 
    var round=req.query.round;
    //console.log(round);
    var dict = [];
    var passed = [];
    var date_array = [];
    var date;
    var length= obj.length;

           
    
    for (var i=0; i < length;i++){
        //console.log(passed);
        for (var k=i; k < length;k++){
           if (obj[i].username != "admin" && obj[k].username !="admin"){
            if ( obj[i].username != obj[k].username && passed.includes(obj[i].username)==false && obj[i].round==round && obj[k].round==round){
               console.log(obj[i].username);
                switch (round){
                    case "0":
                      date =Math.floor(Math.random() * (10 - 1 + 1)) + 1;
                      while (date_array.includes(date)){
                        date =Math.floor(Math.random() * (10 - 1 + 1)) + 1;
                      }
                      date_array.push(date);
                    break;
                    case "1":
                      date =Math.floor(Math.random() * (17 - 12 + 1)) + 12;
                      while (date_array.includes(date)){
                        date =Math.floor(Math.random() * (17 - 12 + 1)) + 12;
                      }
                      date_array.push(date);
                      break;
                    case "2":
                      date =Math.floor(Math.random() * (25 - 19 + 1)) + 19;
                      while (date_array.includes(date)){
                        date =Math.floor(Math.random() * (25 - 19 + 1)) + 19;
                      }
                      date_array.push(date);
                      break;
                      case "3":
                      date =Math.floor(Math.random() * (30 - 27 + 1)) + 27;
                      while (date_array.includes(date)){
                        date =Math.floor(Math.random() * (30 - 27 + 1)) + 27;
                      }
                      date_array.push(date);
                      break;

                }
                console.log(date_array);
                dict.push({
                    
                    key : "round["+ round + "] " + obj[i].username + " VS " + obj[k].username ,
                    value : date
                });
                passed.push(obj[i].username);
                passed.push(obj[k].username);
                
                switch (round) {
                    
                    case "0":
                    obj[i].opponent1=obj[k].username;
                    obj[k].opponent1=obj[i].username;
                    obj[i].date1=date;
                    obj[k].date1=date;
                    break;
                    case "1":
                    obj[i].opponent2=obj[k].username;
                    obj[k].opponent2=obj[i].username;
                    obj[i].date2=date;
                    obj[k].date2=date;
                    break;
                    case "2":
                    obj[i].opponent3=obj[k].username;
                    obj[k].opponent3=obj[i].username;
                    obj[i].date3=date;
                    obj[k].date3=date;
                    break;
                    case "3":
                    obj[i].opponent4=obj[k].username;
                    obj[k].opponent4=obj[i].username;
                    obj[i].date4=date;
                    obj[k].date4=date;
                    break;
                }
                //break;
            }
        }
       
    }
  
    
        fs.writeFile("data.json", JSON.stringify(obj), function(err) {
            if(err) {
                return console.log(err);
            }
            //console.log("The file was saved!");
        }); 
       
}


    
    resp.send(dict);
    console.log(dict);
});

app.get('/updateRound',function (req,resp) { 
    var player=req.query.player;
    var round=req.query.round;
    for (var i=0 ; i < obj.length ; i++){
        if (obj[i].username==player){
            obj[i].round=parseInt(round)+1;
            
        }
    }
      
    
    fs.writeFile("data.json", JSON.stringify(obj), function(err) {
        if(err) {
            return console.log(err);
        }
        console.log("The file was saved!");
    }); 
    round=parseInt(round)+1;
    if (round==3 && obj.length==9){
        resp.send( player + " is the winner");
    }else if ((round==3 && obj.length==10) || (round==3 && obj.length==11))  {
        resp.send( player + " is the winner");
    }else {
        resp.send( player + " will proceed to round " + round);
    }
});

app.get('/newTournament',function (req,resp) { 
    for (var i=0 ; i < obj.length ; i++){
       obj[i].date="";
       obj[i].date1="";
       obj[i].date2="";
       obj[i].date3="";
       obj[i].date4="";
       obj[i].opponent="";
       obj[i].opponent1="";
       obj[i].opponent2="";
       obj[i].opponent3="";
       obj[i].opponent4="";
       obj[i].round=0;

    }
    fs.writeFile("data.json", JSON.stringify(obj), function(err) {
        if(err) {
            return console.log(err);
        }
        console.log("The file was saved!");
    }); 
    resp.send("New Torunament was created");
});



module.exports=app;