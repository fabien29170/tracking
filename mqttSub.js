// When passing async functions as event listeners, make sure to have a try catch block

const doStuff = async (client) => {

	console.log("Starting");
	try {
		await client.subscribe("tracking/#");
		// This line doesn't run until the server responds to the publish
		//await client.end();
        // This line doesn't run until the client has disconnected without error
        
        client.on('message', function (topic, message) {
            // message is Buffer
            console.log(message.toString())
            //client.end()
        })
		console.log("Done");
	} catch (e){
		// Do something about it!
		console.log(e.stack);
		process.exit();
	}
}

