var amqp = require('amqplib');
//npm package to manage airplanes
var Plane = require('planes-generator');
//npm package to manage IFTTT invocation
var IFTTT = require('ifttt-webhooks-channel');
const ifttt = new IFTTT('nAmIL7W45OeEbYrF8O0LytYaup7YdU5REgRnKYtNdUp');

// This function sends messages to the fuel_logger on the amqp topic logs/arrivals/fuel
function send_feedback(msg){
    var q = 'logs/arrivals/fuel';
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

// This function catchs the event from the mqttMessageDispatcher every time a plane lands
exports.handler = function(context, event) {
    var _event = JSON.parse(JSON.stringify(event));
    // recreate the plane received as event
    var currentPlane = new Plane(_event.body.data);
    var date = new Date();       
      
    context.callback("feedback ");
    
    // write on the fuel_logger
    send_feedback(currentPlane.model + " " + currentPlane.name + " is " + currentPlane.tag + " with " + currentPlane.fuelLevel + "% of fuel. Fuel needing computed: " + currentPlane.computeRefuel() + " liters!");

    // invoke the webhook
    ifttt.post('plane_refueling', [currentPlane.model + " - " + currentPlane.name,
                                    date.getDate() + "/" + (date.getMonth()+1) + "/" + date.getFullYear() + " - " + (date.getHours()+1) + ":" + date.getMinutes(),
                                      currentPlane.computeRefuel() + " liters"]);
  };