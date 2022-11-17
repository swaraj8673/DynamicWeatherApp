const http = require('http');
const fs = require('fs');
var requests = require('requests');

const home = fs.readFileSync('index.html', 'utf-8');

const replaceVal = ((tempVal, ogVal) => {
    tempVal = tempVal.replace("{%LocationCity%}", ogVal.name);
    tempVal = tempVal.replace("{%Country%}", ogVal.sys.country);
    tempVal = tempVal.replace("{%Temperature%}", Math.round(ogVal.main.temp-273.00));
    tempVal = tempVal.replace("{%Cloulds%}", ogVal.weather.main);
    tempVal = tempVal.replace("{%MinTemp%}", Math.round(ogVal.main.temp_min-273.00));
    tempVal = tempVal.replace("{%MaxTemp%}", Math.round(ogVal.main.temp_max-273.00));
    tempVal = tempVal.replace("{%Humidity%}", ogVal.main.humidity);
    tempVal = tempVal.replace("{%WindSpeed%}", ogVal.wind.speed);
    tempVal = tempVal.replace("{%FeelsLike%}", Math.round(ogVal.main.feels_like-273.00));
    tempVal = tempVal.replace("{%Pressure%}", ogVal.main.pressure);

    return tempVal;
});


const server = http.createServer((req, res) => {
    requests('https://api.openweathermap.org/data/2.5/weather?q=Bhubaneswar&appid=ee6cc6680b9ce81b7df5332b412c5cff')
        .on('data', (chunk) => {
            // console.log(chunk)
            const objectData = JSON.parse(chunk);
            const arrData = [objectData];
            const realTimeData = arrData.map(val => replaceVal(home, val)).join('');
            res.write(realTimeData);
        })
        .on('end', function (err) {
        if (err) return console.log('connection closed due to errors', err);
 
        res.end();
    });
});

server.listen(3000);

