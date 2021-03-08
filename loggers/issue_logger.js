// This logger logs messages consumed from amqp topic "logs/arrivals/issues"
var amqp = require('amqplib');

amqp.connect('amqp://guest:guest@192.168.1.7:5672').then(function(conn) {
  process.once('SIGINT', function() { conn.close(); });
  return conn.createChannel().then(function(ch) {

    var ok = ch.assertQueue('logs/arrivals/issues', {durable: false});

    ok = ok.then(function(_qok) {
      return ch.consume('logs/arrivals/issues', function(msg) {
        console.log(" [x] Received '%s'", msg.content.toString());
      }, {noAck: true});
    });

    return ok.then(function(_consumeOk) {
      console.log(' [*] Waiting for messages. To exit press CTRL+C');
    });
  });
}).catch(console.warn);

