const express = require("express");
const bodyParser = require("body-parser");
const res = require("express/lib/response");
const https = require("https");

var app = express();
app.use(bodyParser.urlencoded({extended: true}));

// map: http://localhost:3000 - basic calculator
// map2: http://localhost:3000/weather - enter city name, and get the weather for it
// map3: http://localhost:3000/bmicalculator - basic bmi calculator

app.get("/", function(req, res) {
    res.sendFile(__dirname + "/index.html")
});

app.post("/", function(req, res){
    var numOne = Number(req.body.num1);
    var numTwo = Number(req.body.num2);
    var result = (numOne + numTwo);

    res.send("The result is: " + result);
}); 

app.get("/bmicalculator", function(req, res) {
    res.sendFile(__dirname+"/bmiCalculator.html")
});

app.post("/bmicalculator", function(req, res) {
    var weight = parseFloat(req.body.weight);
    var height = parseFloat(req.body.height);
    var bmi = weight / (height * height)
    
    res.send("Your BMI is: "+bmi)
});

app.get("/weather", function(req, res) {
    res.sendFile(__dirname + "/weather.html");
    
});

app.post("/weather", function(req, res) {
    const query = req.body.cityName;
    const url = "https://api.openweathermap.org/data/2.5/weather?q="+query+"&appid=0303e3ab2c4dd64710ba32e7b3d4c5c5";
    
    https.get(url, function(response) {

        response.on("data", function(data){
            const weatherData = JSON.parse(data)
            const temp = weatherData.main.temp
            const weatherDescription = weatherData.weather[0].description
            const icon = weatherData.weather[0].icon
            const imageURL = "http://openweathermap.org/img/wn/"+icon+"@2x.png";
            res.write(`<h1>Currently is " ${weatherDescription} "</h1>`);
            res.write(`<h1>And it's ${temp} degrees in ${query}.</h1>`);
            res.write(`<img src=${imageURL}>`)
            res.send()
        })
    });
});



app.listen(3000, function() {
    console.log(`Server started at port 3000`);
});




