var mqtt = require('mqtt');
var client  = mqtt.connect('mqtt://test.mosquitto.org');
var count=0;
 
client.on('connect', function () {
  console.log("Callback connected "+ client.connected);
  setInterval(function(){
    count+=1;
    longitude = 3+count/100;
    timestamp = new Date();
    sentence = '{"lon":'+longitude+',"lat":3.2566,"cog":258,"sog":15.8,"timestamp":"'+timestamp.toISOString()+'"}';
    console.log("Publishing "+sentence);
    client.publish('tracking/boat-52358/nav', sentence,{retain:true,qos:1});
},5000);
  })
