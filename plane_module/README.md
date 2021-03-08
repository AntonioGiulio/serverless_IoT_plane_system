# Planes Generator

## Description 
This is a JavaScript class created specifically for a small university project in order to be used as a module for other functions in a serverless architecture. 
The project simulates the approach and landing of airplanes at an airport, the task of this module is to generate an airplane instance which obviously has properties.

Every plane has:
  - **model**: airplane model, is randomly chosen from a set of models, precisely among the 7 most produced models in the world
  - **name**: airplane identifier, an alphanumeric string made up of 5 randomly chosen characters
  - **fuelLevel**: an integer indicating the aircraft's fuel percentage
  - **capacity**: indicates the exact tank capacity of the selected aircraft model
  - **tag**: indicates if the airplane is arriving or has landed, it can have the value 'ARRIVING' or '_LANDED_ "
  - **undercarriages**: number of undercarriages for that airplane model
  - **tires**: number of wheels for that airplane model
  - **undercarriagesIssue**: is an integer indicating which undercarriage needs maintenance
  - **tireIssue**: is an integer indicating which tire has a pressure drop
  - **casualIssue**: is a message that contains a typical malfunction that can afflict an aircraft

## Basic Usage
Install with npm:
```bash
$ npm install plane-generator
```

```javascript
var Plane = require('planes-gemerator');

/* -> basic constructor method without arguments
it generate a new plane from scratch */
var myPlane = new Plane();

/* -> constructor with one argument that is a toString() method from another Plane object, it needs in order to recreate a Plane object at different endpoints in the serverless architecture */
var myPlane_1 = new Plane(_data);

myPlane.decreaseFuelLevel();
// -> it decrease the percentage of the fuel

myPlane.computeRefuel();
// -> it calculates the needing fuel in liter

myPlane.produceTiresIssues();
// -> it selects an undercarriage and a tire to signal a malfunction

myPlane.produceCasualIssues();
// -> it select a general issue thath can affects the plane

//getters
myPlane.model;
// it returns the model value of the plane
...
```

## Available methods for a  Plane Generator instance
- **decreaseFuel()** - decreases the fuelValue of 1
- **computeRefuel()** - calculates the fuel needing in liter.
- **land()** - changes tag in "LANDED".
- **produceTiresIssues()** - selects randomply a tire from tires to signal a pressure drop.
- **produceCasualIssues()** - selects randomply an issue from a set of typical issues.
- **toString()** - returns a string with "model name fuelLevel% tag undercarriagesIssue tireIssue casualIssue"
- **model** - returns a model propertie
- **name** - returns a name propertie
- **fuelLevel** - retruns a fuel level propertie
- **fuelLevel(x)** - set a new fuel level
- **capacity** - returns a capacity propertie
- **capacity(x)** - set new capacity
- **tag** - retruns a tag propertie
- **undercarriages** - returns the number of undercarriages
- **tires** - retruns the number of tires
- **undercarriagesIssue** - retruns a undercarriage with malfunction
- **tireIssue** - retruns a tire with a pressure drop
- **casualIssue** - returns a string with a casual issue