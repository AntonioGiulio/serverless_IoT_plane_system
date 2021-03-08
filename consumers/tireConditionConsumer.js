var amqp = require('amqplib');
//npm package to manage airplanes 
var Plane = require('planes-generator');

// This function sends messages to the tire_logger on the amqp topic logs/arrivals/tires
function send_feedback(msg){
    var q = 'logs/arrivals/tires';
    amqp.connect('amqp://guest:guest@192.168.1.7:5672').then(function(conn) {
      return conn.createChannel().then(function(ch) {
        var ok = ch.assertQueue(q, {durable: false});
        return ok.then(function(_qok) {
          ch.sendToQueue(q, Buffer.from(msg));
          console.log(" [x] Sent '%s'", msg);
          return ch.close();
        });
      }).finally(function() {
        conn.close();
      });
    }).catch(console.warn);
}

// This function catches the event from the mqttMessageDispatcher every time a plane lands
exports.handler = function(context, event) {
    var _event = JSON.parse(JSON.stringify(event));
    // recreate the plane received as event
    var currentPlane = new Plane(_event.body.data);
  
    context.callback("feedback ");
    
    // write on the tire_logger
    send_feedback(currentPlane.model + " " + currentPlane.name + " is " + currentPlane.tag + "! Manteinance undercarriage n: " + currentPlane.undercarriagesIssue + "! Pressure drop detected at tire n: " + currentPlane.tierIssue);
  };