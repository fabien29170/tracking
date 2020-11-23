const xml2js = require('xml2js');
const fs = require('fs');
var mqtt = require('mqtt');
var client  = mqtt.connect('mqtt://test.mosquitto.org');
var count=0;
var latWptCourant=0;
var lonWptCourant=0;
var pasLat=0;
var pasLon=0;
var COG=90;

// read XML from a file
const xml = fs.readFileSync('gpxTrack.xml');

// convert XML to JSON
xml2js.parseString(xml, { mergeAttrs: true }, (err, result) => {
    if (err) {
        throw err;
    }

    // `result` is a JavaScript object
    // convert it to a JSON string
    const json = JSON.stringify(result, null, 4);

    console.log(result.gpx.wpt[1].lon);
    latWpt0=parseFloat(result.gpx.wpt[0].lat);
    lonWpt0=parseFloat(result.gpx.wpt[0].lon);
    latWpt1=parseFloat(result.gpx.wpt[1].lat);
    lonWpt1=parseFloat(result.gpx.wpt[1].lon);
    pasLat=(latWpt1-latWpt0)/100;
    pasLon=(lonWpt1-lonWpt0)/100;
    COG=90-Math.atan(pasLat/pasLon);

    latWptCourant=latWpt0;
    lonWptCourant=lonWpt0;

    // save JSON in a file
    fs.writeFileSync('user.json', json);

}); 



client.on('connect', function () {
  console.log("Callback connected "+ client.connected);
  setInterval(function(){
    latWptCourant+=pasLat;
    lonWptCourant+=pasLon;
    timestamp = new Date();
    sentence = '{"lon":'+lonWptCourant+',"lat":'+latWptCourant+',"cog":'+COG+',"sog":15.8,"timestamp":"'+timestamp.toISOString()+'"}';
    console.log("Publishing "+sentence);
    client.publish('tracking/boat-52358/nav', sentence,{retain:true,qos:1});
},1000);
  })
