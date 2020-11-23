var WebSocketClient = require('websocket').client;
var client = new WebSocketClient();
var websocketConnection;
var signalkToken;

const MQTT = require("async-mqtt");
const mqttClient = MQTT.connect("mqtt://test.mosquitto.org");


const doStuff = async () => {

    client.connect('ws://127.0.0.1:3000/signalk/v1/stream?subscribe=none', 'echo-protocol');
    console.log("Listening to MQTT");
	try {
		await mqttClient.subscribe("tracking/#");
		// This line doesn't run until the server responds to the publish
		//await client.end();
        // This line doesn't run until the client has disconnected without error
        
        mqttClient.on('message', function (topic, message) {
            // message is Buffer
            //console.log(message.toString())
            dataSend(websocketConnection,signalkToken);
            //client.end()
        })
		console.log("Done");
	} catch (e){
		// Do something about it!
		console.log(e.stack);
		process.exit();
	}
}


function authentRequest(connection){
    let authentMsg={
        "requestId": "1234-45653-343455",
        "login": {
          "username": "fapu",
          "password": "Hydro!2022"
        }
      };
      connection.send(JSON.stringify(authentMsg));

};

function dataSend(connection, token){
    console.log("datasending...");
    let count=0;
        count+=1;
        latitude = 47.80+count/10000;
        timestamp = new Date();
        var msgPosition=
        {
            "token":token,
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

}

client.on('connectFailed', function(error) {
    console.log('Connect Error: ' + error.toString());
});

client.on('connect', function(connection) {
    console.log('WebSocket Connected to Server');
    
    websocketConnection=connection;
    connection.on('error', function(error) {
        console.log("Connection Error: " + error.toString());
    });
    connection.on('close', function() {
        console.log('echo-protocol Connection Closed');
    });
    connection.on('message', function(message) {
        if (message.type === 'utf8') {
            var objJSON=JSON.parse(message.utf8Data);
            if(objJSON.name)
            {
                console.log("Connected to "+objJSON.name.toString());
                console.log("Sending authentifation request...");
                authentRequest(connection);
            }
            else if (objJSON.login)
            {
                console.log("Received authentification token");
                //console.log("Sending datas...");
                tokenAuthent=objJSON.login.token;
                signalkToken=tokenAuthent;
                //dataSend(connection, tokenAuthent);
            }
        }
    });
});
mqttClient.on("connect", doStuff);

