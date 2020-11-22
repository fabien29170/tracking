#!/usr/bin/env node
var WebSocketClient = require('websocket').client;
 
var client = new WebSocketClient();
var tokenAuthent="";
var timestamp=new Date().toISOString();
var count=0;


var msgAuthent={
    "requestId": "1234-45653-343455",
    "login": {
      "username": "fapu",
      "password": "Hydro!2022"
    }
  };

  
client.on('connectFailed', function(error) {
    console.log('Connect Error: ' + error.toString());
});
 
client.on('connect', function(connection) {
    var reponse="";
    console.log('WebSocket Client Connected');
    connection.on('error', function(error) {
        console.log("Connection Error: " + error.toString());
    });
    connection.on('close', function() {
        console.log('echo-protocol Connection Closed');
    });
    connection.on('message', function(message) {
        if (message.type === 'utf8') {
            var objJSON=JSON.parse(message.utf8Data);
            console.log("Received: '" + message.utf8Data + "'");
            console.log(objJSON);
            if (objJSON.login)
            {
                tokenAuthent=objJSON.login.token;
                console.log(tokenAuthent);
            }
        }
        setInterval(function(){
            count+=1;
            latitude = 47.80+count/10000;
            timestamp = new Date();
            var msgPosition=
            {
                "token":tokenAuthent,
                 "context": "vessels.urn:mrn:imo:mmsi:234567890",
                 "name" : "boat-5623",
                 "updates": [
                    {
                    "source": {
                        "label": "N2000-01",
                        "type": "NMEA2000",
                        "src": "017",
                        "pgn": 127488
                    },
                    "timestamp": timestamp,
                    "values": [
                        {
                        "path" : "name",
                        "value" : "boat-26563"
                        },
                         {
                        "path":"navigation.speedOverGround",
                        "value": 4.32693662
                        },
                        {
                        "path":"navigation.position",
                        "value": {
                            "altitude": 0.0,
                            "latitude": latitude,
                            "longitude": -3.96
                        }
                        },            
                        {
                        "path":"navigation.headingMagnetic",
                        "value": 5.55014702
                        }
                    ]
                    }
                ]
            }
        
           
            console.log(JSON.stringify(msgPosition));
            connection.send(JSON.stringify(msgPosition));
        },1000);
        
    });
    
    function sendNumber() {
        if (connection.connected) {
            var number = Math.round(Math.random() * 0xFFFFFF);
            connection.sendUTF(number.toString());
            setTimeout(sendNumber, 1000);
        }
    }
    //sendNumber();
    connection.send(JSON.stringify(msgAuthent));
    tokenAuthent=reponse;


});
 
client.connect('ws://127.0.0.1:3000/signalk/v1/stream?subscribe=none', 'echo-protocol');

