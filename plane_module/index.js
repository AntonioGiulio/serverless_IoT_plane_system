//npm module required for hashtable
var SimpleHashTable = require('simple-hashtable');

//This function generates an airplane ID consisting of 5 alphanumeric characters
function generateName() {
    var sRnd = '';
    var sChrs = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
    for (var i = 0; i < 5; i++) {
      var randomPoz = Math.floor(Math.random() * sChrs.length);
      sRnd += sChrs.substring(randomPoz, randomPoz + 1);
    }
    return sRnd;
}

//This function convert a binary string to a character string
function bin2string(array){
    var result = "";
    for(var i = 0; i < array.length; ++i){
      result += (String.fromCharCode(array[i]));
    }
    return result;
}

class Plane {

    constructor(rawData) {
        //Set of airplanes models
        this.planeModels = ["Boeing-747", "Airbus-A320", "Douglas-DC-9", "Boeing-777", "Airbus-A300", "Airbus-A330", "Boeing-757"];
        this.planeSet = new SimpleHashTable();
        //We associate the capacity in liters of the tank, the number of carriages and the number of wheels with the airplane model
        this.planeSet
            .put('Boeing-747', [216824, 4, 16])
            .put('Airbus-A320', [23859, 3, 6])
            .put('Douglas-DC-9', [13926, 3, 6])
            .put('Boeing-777', [181283, 3, 14])
            .put('Airbus-A300', [68160, 3, 10])
            .put('Airbus-A330', [139090, 3, 10])
            .put('Boeing-757', [42680, 3, 10]);
        //Set of possible issues affecting airplanes
        this.genralIssues = ["Possible damage to the fuselage",
            "Possible damage to the right wing",
            "Possible damage to the left wing",
            "Possible damage to the right flaps",
            "Possible damage to the left flaps",
            "Possible damage to the tail", 
            "Possible right engine malfunction",
            "Possible left engine malfunction",
            "Possible fuel leak",
            "Possible refrigerant leak",
            "Possible depressurization of the hold"];
  
        //Number for select a random plane from planeModels
        this.n = Math.floor(Math.random() * this.planeModels.length);
        
        //We have to distinguish the situation in which we receive a string containing the info of an airplane 
        // from the one in which we have to generate an airplane from scratch

        //recreate a plane from rawData recived
        if(arguments.length == 1) {

            let data = bin2string(rawData);
            let firstSpace = data.indexOf(" ");
            let percent = data.indexOf("%");
  
            this._model = data.substring(0, firstSpace);
            this._name = data.substr(firstSpace + 1, 5);
            this._fuelLevel = data.substring(firstSpace + 6, percent);
            this._capacity = this.planeSet.get(this.model)[0];
            this._tag = data.substr(percent + 2, 8);      
            
            this._undercarriages = this.planeSet.get(this.model)[1];
            this._tiers = this.planeSet.get(this.model)[2];
            this._undercarriagesIssue = data.substr(percent + 11, 1);
            this._tierIssue = data.substr(percent+13, 2);
            this._casualIssue = data.substring(percent + 15);
           
        }else {  //start from scratch
            
            this._model = this.planeModels[this.n];
            this._name = generateName();
            this._fuelLevel = Math.floor(Math.random()*85)+15;
            this._capacity = this.planeSet.get(this.model)[0];
            this._tag = "ARRIVING";       
            
            this._undercarriages = this.planeSet.get(this.model)[1];
            this._tiers = this.planeSet.get(this.model)[2];
            this._tierIssue = "";
            this._undercarriagesIssue = "";
            this._casualIssue = ""
        } 
    }
  
    //this function compute the fuel needing 
    computeRefuel() {
        return ((100 - this._fuelLevel) / 100) * this._capacity;
    }
  
    //this function decrease the percentage of fuel level of 1
    decreaseFuelLevel() {
        this._fuelLevel--;
    }
    
    //This function change the tag of the plane into "_LANDED_"
    land() {
        this._tag = "_LANDED_";
    }
    
    //This function select a random undercarriage and a random tire to trigger
    produceTiresIssues() {
        this._tierIssue = Math.floor(Math.random() * this._tiers) + 1;
        this._undercarriagesIssue = Math.floor(Math.random() * this._undercarriages) + 1;
    }
    
    //This function select a random problem of plane to trigger
    produceCasualIssues() {
        this._casualIssue = this.genralIssues[Math.floor(Math.random() * this.genralIssues.length)];
    }
    
    toString() {
        return this._model + " " + this._name + " " + this._fuelLevel + "% " + this._tag + " " + this._undercarriagesIssue + " " + this._tierIssue + " " + this._casualIssue;
    }
  
    //getters and setters
    get model() {
        return this._model;
    }
  
    get name() {
        return this._name;
    }
  
    get fuelLevel() {
        return this._fuelLevel;
    }
  
    set fuelLevel(x) {
        this._fuelLevel = x;
    }
  
    get capacity() {
        return this._capacity;
    }
  
    set capacity(x) {
        this._capacity = x;
    }
  
    get tag() {
        return this._tag;
    }
  
    get undercarriages() {
        return this._undercarriages;
    }
  
    get tires() {
        return this.tires;
    }
  
    get tierIssue() {
        return this._tierIssue;
    }
  
    get undercarriagesIssue() {
        return this._undercarriagesIssue;
    }
  
    get casualIssue() {
        return this._casualIssue;
    }
  }

  module.exports = Plane;
  