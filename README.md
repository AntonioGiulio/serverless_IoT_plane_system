> # serverless_IoT_plane-system
### Serverless Computing for IoT

## Introduction
The IoT industry is revolutionizing the **Aerospace and Defence (A&D)** sector, over **91.5 billion dollars** were invested last year. 
The application of IoT devices in aviation, such as small sensors and actuators, improve their efficiency, safety, control and costs.

Pilots and eventually AI support for the autoflight system need a constant data provisioning from sensors in different part of the plane, like wings for lifting and fuel level, from engines, from tires, from hold, also informations about external and internal pressure and temperature.

The crucial aspect is that these flight datas can be analyzed in real-time, the engineers and ground-crews can diagnose any malfunctions and arrange maintenance in order to **minimize downtime**.

This project focuses on the processing of these data on ground-control, it consists in a computing architecture based on open-source software that exploits the FaaS model in the context of IoT.

## Tools
* Application containers engine <span style="color:darkorange">**Docker**</span> and <span style="color:darkorange">**Docker Compose**</span>.

* Serverless computing provider <span style="color:darkorange">**Nuclio**</span>.

* **MQTT** and **AMQP** message broker <span style="color:darkorange">**RabbitMQ**</span>.

* JavaScript Application runtime <span style="color:darkorange">**Node.js**</span>.

* Applets management service <span style="color:darkorange">**IFTTT**</span>.

## Scenario
The system simulates the **approach** and **landing** of airplanes at the airport.
Each airplane has sensors that produce information regarding the fuel level, the condition of tires and various malfunctions.

An approaching airplane sends these data through the MQTT protocol, which are processed by different functions in a serverless manner, and subsequently logged and stored.

In this way the Ground Crew can prepare the exact amount of the necessary fuel, it already knows what are the tires that need maintenance and any damage that the aircraft suffered.
Through the use of these systems it has been shown that the downtime is reduced by around **30-40%**.

## Planes abstraction
To abstract and manage airplanes I created a JavaScript class called `planes-generator`.

Each instance of airplane has:

* **`model`**: airplane model, is randomly chosen from a set of models, precisely among the 7 most produced models in the world.
* **`name`**: airplane identifier, an alphanumeric string made up of 5 randomly chosen characters
* **`capacity`**: indicates the exact tank capacity of the selected aircraft model
* **`fuelLevel`**: an integer indicating the aircraft's fuel percentage
* **`tag`**: indicates if the airplane is arriving or has landed, it can have the value 'ARRIVING' or “_LANDED_ "
* **`undercarriages`**: number of undercarriages for that airplane model
* **`tires`**: number of wheels for that airplane model
* **`undercarriagesIssue`**: is an integer indicating which undercarriage needs maintenance
* **`tireIssue`**: is an integer indicating which tire has a pressure drop
* **`casualIssue`**: is a string containing a typical malfunction that can afflict an aircraft

To make this class available across all Nuclio functions, I published it on my public **NPM** profile. In this way anyone who uses Node.js can exploit the code by simply installing it by writing: `npm i planes-generator`.

Here the NPM page: [<span style="color:darkorange">**planes-generator**</span>]( https://www.npmjs.com/package/planes-generator)

## Architecture
![](/media/architecture.png)

## Functions
The application is composed by 5 functions:

* 1 <span style="color:darkorange">**Producer**</span> function
* 4 <span style="color:darkorange">**Consumer**</span> functions
* 4 <span style="color:darkorange">**Logger**</span> functions

### <span style="color:darkorange">**Plane Producer**</span>
Whenever this function is invoked, **it creates a new airplane instance** and then **sends** the data on the MQTT topic <span style="color:darkorange">`iot/planes/arrivals`</span>.

To simulate the approach and then landing, the data relating to the airplane are **sent every 5 seconds for a minute** with a **decreasing `fuel_level`** to simulate fuel consumption.
We can iterate these sendings exploiting `setTimeout()`, `setInterval()` and `clearInterval()` functions.

The last message published for each airplane is the **landing message**, during this landing procedure, tire issues and other casual issues are generated.


### <span style="color:darkorange">**Message Dispatcher**</span>
This function is **triggered** by a new MQTT message on the topic <span style="color:darkorange">`iot/planes/arrivals`</span> containing the plane information produced by `Plane Producer`.

For each message received send a **feedback** on the AMQP channel <span style="color:blue">`logs/arrivals`</span> with the `plane name`, `model` and current `fuel_level`.

Only when the plane lands the Message Dispatcher publishes his data on 3 different MQTT topics, a sort of **forwarding**:

* <span style="color:darkorange">`iot/planes/arrivals/fuel`</span>
* <span style="color:darkorange">`iot/planes/arrivals/issues`</span>
* <span style="color:darkorange">`iot/planes/arrivals/tires`</span>


### <span style="color:darkorange">**Fuel Consumer**</span>
This function is **triggered** by a new MQTT message on the topic <span style="color:darkorange">`iot/planes/arrivals/fuel`</span> containing the plane information forwarded by the `Message Dispatcher` function.

The Fuel Consumer deals with calculating the exact amount of fuel needed to refuel the aircraft, then publish this information on the AMQ channel <span style="color:blue">`logs/arrivals/fuel`</span>.

### <span style="color:darkorange">**Issue Consumer**</span>
This function is **triggered** by a new MQTT message on the topic <span style="color:darkorange">`iot/planes/arrivals/issues`</span> containing the plane information forwarded by the `Message Dispatcher` function.

The Issue Consumer deals with updating the AMQP channel <span style="color:blue">`logs/arrivals/issue`</span> with information concerning the possible malfunctions detected during the previous flight.

### <span style="color:darkorange">**Tire Condition Consumer**</span>
This function is **triggered** by a new MQTT message on the topic <span style="color:darkorange">`iot/planes/arrivals/tires`</span> containing the plane information forwarded by the `Message Dispatcher` function.

The Tire Condition Consumer deals with updating the AMQP channel <span style="color:blue">`logs/arrivals/tires`</span> with information concerning which tires and which undercarriage need immediate maintenance.

## Loggers
As we have previously seen we have 4 loggers, each associated with a consumer function and listening on a AMQP dedicated channel:

* **general_logger** listening on <span style="color:blue">`logs/arrivals`</span>
	![](/media/general.png)
* **fuel_logger** listening on <span style="color:blue">`logs/arrivals/fuel`</span>
	![](/media/fuel.png)
* **issuel_logger** listening on <span style="color:blue">`logs/arrivals/issue`</span>
	![](/media/issue.png)
* **tire_logger** listening on <span style="color:blue">`logs/arrivals/tire`</span>
	![](/media/tire.png)

## IFTTT
Once the system described above was implemented and tested, I decided to add a **WebHook** through the use of **IFTTT**.

**<span style="color:darkorange">I</span>f <span style="color:darkorange">T</span>his <span style="color:darkorange">T</span>hen <span style="color:darkorange">T</span>hat (IFTTT)** is a service that allows a user to program a response to events in the world of various kinds. The programs, called **applets**, are simple and created graphically.

IFTTT employs the following concepts:

* **Services** are the basic building blocks of IFTTT. They describe a series of data from a certain web service. Each service has a particular set of triggers and actions.
* **Triggers** are the “*this*” part of an applet. They are the items that trigger the action. In our case the incoming message on a MQTT topic.
* **Actions** are the “*that*” part of an applet. They are the output that results from the input of the trigger.

IFTTT manages a very wide range of services that can be involved in a causal relationship.

For the Plane-system I created three applets using the following services offered by IFTTT:

![](/media/webhooks.png) ![](/media/webdescr.png)

![](/media/sheets.png) ![](/media/sheetsdescr.png)

The first applet is called **plane_landed**.

It is connected to **Message Dispatcher**, every time a plane lands, the applet is invoked and updates an excel file on my Google Drive which acts as a <span style="color:darkgreen">**Landing_Archive**</span>.

![](/media/landings_archive.png)

In the same way the other two applets (**plane_refuelig** and **plane_malfunction**) are connected one with **Fuel Consumer** function, and the other with **Issue Consumer** function, in order to create a <span style="color:darkgreen">**Refuelings_Archive**</span> and a <span style="color:darkgreen">**Malfunctions_Archive**</span>:

![](/media/refueling_archive.png) 

![](/media/malfunction_archive.png)

To integrate these applet in my code I have exploited the **NPM** package **`ifttt-webhooks-channel`** (installable with `npm i ifttt-webhooks-channel`) that provide a simple post method to trigger the webhook as follow:
```
// invoke the webhook
        ifttt.post('plane_landed', [currentPlane.model + " - " + currentPlane.name,
                                     date.getDate() + "/" + (date.getMonth()+1) + "/" + date.getFullYear(),
                                      (date.getHours()+1) + ":" + date.getMinutes()]);
```

## How to Run
1. Install **Docker** and **Docker Compose**.
2. Start **Nuclio** through Docker: `$ docker run -p 8070:8070 -v /var/run/docker.sock:/var/run/
docker.sock -v /tmp:/tmp nuclio/dashboard:stable-amd64`
then browse to [http://localhost:8070](http://localhost:8070) to use Nuclio Dashboard.
3. Start **RabbitMQ** through Docker: `$ docker run -p 9000:15672  -p 1883:1883 -p 5672:5672  cyrilix/rabbitmq-mqtt`
then browse to [http://localhost:9000](http://localhost:9000) and login using username:guest and password:guest, to access to RabbitMQ management, where is possible to visualize the message queues and the broker status.
4. Replace all IP addresses in the code with your own, also in the `.yaml` files and in logger functions. Then updates the `functionSourceCode` field in all `.yaml` files with the base64 encoding of the functions.
5. Browse to Nuclio Dashboard and create a new project uploading producer and consumers functions, then deploy all.
6. Start all loggers with `node logger_name.js` in the terminal.
7. Test the `planeProducer` function and observe messages on loggers.
8. If you want, create your applets with **IFTTT** and update the fields in the code.



