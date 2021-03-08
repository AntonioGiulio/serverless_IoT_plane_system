var mqtt = require('mqtt'), url = require('url');
// npm package to manage airplanes
var Plane = require('planes-generator');

var mqtt_url = url.parse(process.env.CLOUDAMQP_MQTT_URL || 'mqtt://guest:guest@192.168.1.7:1883');
var auth = (mqtt_url.auth || ':').split(':');
var url = "mqtt://" + mqtt_url.host;

var options = {
  port: mqtt_url.port,
  clientId: 'mqttjs_' + Math.random().toString(16).substr(2, 8),
  username: auth[0],
  password: auth[1],
};

// Here we put the logic to simulate the approaching of the plane to airport!
exports.handler = function(context, event) {

    //Generate a new plane from scratch
    var currentPlane = new Plane();
    
    // sends a feedback of the plane status 
    function iterateSending (){
        var client = mqtt.connect(url, options);  
        client.on('connect', function() {
            client.publish('iot/planes/arrivals', currentPlane.toString(), function() {
                client.end();  
                context.callback('MQTT Message Sent');
            });   
        });
        // decrease the fuel level at each feedback to simulate the fuel consumption
        currentPlane.decreaseFuelLevel();
    }

    iterateSending();
    // setInterval execute the iterateSending function every five seconds until clearInterval Invocation
    var timer = setInterval(iterateSending, 5*1000);

    // This function causes the code passed as the first parameter to be executed after 60 seconds
    setTimeout(function() {
        // Stops the setInterval recurrent invocations
        clearInterval(timer);
        // The current plane lands
        currentPlane.land();
        // genrates some issues
        currentPlane.produceTiresIssues();
        currentPlane.produceCasualIssues();
        var client = mqtt.connect(url, options);  
        client.on('connect', function() {
            // publish the informations on the main mqtt topic iot/planes/arrivals
            client.publish('iot/planes/arrivals', currentPlane.toString(), function() {
                client.end();  
                context.callback('MQTT Message Sent');
            });   
        });
    }, 60000);
  
};