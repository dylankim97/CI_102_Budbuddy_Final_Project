// 

//const mtaKey = '4683d287-9068-4fbe-b936-e3b839a7dd10' //This key is generated using CI102 gmail account
const mtaKey = 'd18eb1ee-a47c-462c-b29e-e7e6714a0442' //This key is generated using CI102 gmail account
//const tomtomAPIkey = 'qnlJQoDsHXkTClk0kSo1hkun4DEA6VXd' //This key is generated using CI102 gmail account
const tomtomAPIkey = 'ObymRmd6GGGVAbiAIRwqkSZhSjP9p5LU' //This key is generated using CI102 gmail account

var displayText = ""

var displayTextArray = []

var busStopData = []

var closestStopArray = []

class bus {
    constructor(route, destination, eta) {
        this.route = route
        this.destination = destination
        this.eta = eta
    }
}

//Default latitude and longitude will be of new york city hall
//Call locationOnMap function with longitude and latitude parameter to point to user's location
function locationOnMap() {


    var map = tt.map({
        key: tomtomAPIkey,
        container: 'map',
        center: [-74.0059,40.7127],  //Make sure it's longitude first and then latitude
        zoom: 14
    });


}

function markerOnMap(userLocation1, closestStop1, closestStop2) {

    var map = tt.map({
        key: tomtomAPIkey,
        container: 'map',
        center: [-74.0059,40.7127],  //Make sure it's longitude first and then latitude
        zoom: 14
    });
    map.addControl(new tt.FullscreenControl());
    map.addControl(new tt.NavigationControl());

    var userMarker = new tt.Marker().setLngLat([userLocation1.longitudeOnMap, userLocation1.latitudeOnMap]).addTo(map);
    var marker1 = new tt.Marker().setLngLat([closestStop1.longitudeOnMap, closestStop1.latitudeOnMap]).addTo(map);
    var marker2 = new tt.Marker().setLngLat([closestStop2.longitudeOnMap, closestStop2.latitudeOnMap]).addTo(map);

    var popupOffsets = {
        top: [0, 0],
        bottom: [0, -70],
        'bottom-right': [0, -70],
        'bottom-left': [0, -70],
        left: [25, -35],
        right: [-25, -35]
    };

    var userPopup = new tt.Popup({offset: popupOffsets}).setHTML("<b> You are here </b>"+"<br/>"+"Address - <b>"+userLocation1.userAddress+"</b>");
    userMarker.setPopup(userPopup).togglePopup();
    var popup1 = new tt.Popup({offset: popupOffsets}).setHTML("Bus Stop ID - <b>"+closestStop1.busStopID+"</b>"+"<br/>"+"Bus Stop Location - <b>"+closestStop1.busStopAddress+"</b>");
    marker1.setPopup(popup1).togglePopup();
    var popup2 = new tt.Popup({offset: popupOffsets}).setHTML("Bus Stop ID - <b>"+closestStop2.busStopID+"</b>"+"<br/>"+"Bus Stop Location - <b>"+closestStop2.busStopAddress+"</b>");
    marker2.setPopup(popup2).togglePopup();

    map.flyTo({
        center: [userLocation1.longitudeOnMap, userLocation1.latitudeOnMap],
        zoom: 16.2,
        screenSpeed: 0.5,
        curve: 2
    })

}

// function wait(ms){
//    var start = new Date().getTime();
//    var end = start;
//    while(end < start + ms) {
//      end = new Date().getTime();
//   }
// }

function getAPI() {
    //Calling this function here without any arguments will make a map default to new york city hall with zoom level 14.
    //This will required because when user enters invalid address we want to go back to default
    //locationOnMap()
    //wait(10000)
    document.getElementById("result").innerText = "Searching..."

    //const proxyurl = "https://cors-anywhere.herokuapp.com/"
    const proxyurl = "https://secret-ocean-49799.herokuapp.com/"
    var address = document.getElementById("address").value

    fetch(proxyurl+'https://api.tomtom.com/search/2/geocode/'+address+'.json?countrySet=US&extendedPostalCodesFor=Addr&key='+tomtomAPIkey)
        .then(res => res.json())
        .then(data => getClosestStop(data, address))
        .catch(error => invalidAddress())
}

function invalidAddress() {

    document.getElementById("result").innerText = "ERROR. Invalid Address"
    locationOnMap()

}


function getClosestStop(userLocation, address) {


    let userLocation1 = {
        latitudeOnMap: userLocation.results[0]["position"]["lat"],
        longitudeOnMap: userLocation.results[0]["position"]["lon"],
        userAddress: address
    };

    //const proxyurl = "https://cors-anywhere.herokuapp.com/"
    const proxyurl = "https://secret-ocean-49799.herokuapp.com/"

    fetch(proxyurl+ 'http://bustime.mta.info/api/where/stops-for-location.json?lat='+userLocation1.latitudeOnMap+'&lon='+userLocation1.longitudeOnMap+'&latSpan=0.005&lonSpan=0.005&key='+mtaKey)
        .then(res => res.json())
        .then(data => realTimeData(userLocation1, data))
        .catch(error => noStopNear())

}

function noStopNear() {

    document.getElementById("result").innerText = "There is no MTA stop near the given location"
    locationOnMap()

}

function realTimeData(userLocation1, dataFromGetClosestStopFunction) {

    var busstopselectionlist = document.getElementById("busstopselectionlist")
    listLength = busstopselectionlist.length
    for(var i = listLength; i > 0; i--) {
        busstopselectionlist.remove(i)
    }

    for (var i = 0; i < dataFromGetClosestStopFunction["data"]["stops"].length; i++) {
        var option = document.createElement("option")
        option.value = (i+1)
        busstopText = "ID - " + dataFromGetClosestStopFunction["data"]["stops"][i]["id"]
        busstopText += ", Address - " + dataFromGetClosestStopFunction["data"]["stops"][i]["name"]
        option.innerHTML = busstopText
        busstopselectionlist.appendChild(option)
    }

    closestStopArray = []

    for(var i = 0; i < dataFromGetClosestStopFunction["data"]["stops"].length; i++) {

        let closestStop = {
            stopcode: dataFromGetClosestStopFunction["data"]["stops"][i]["code"],
            latitudeOnMap: dataFromGetClosestStopFunction["data"]["stops"][i]["lat"],
            longitudeOnMap: dataFromGetClosestStopFunction["data"]["stops"][i]["lon"],
            busStopID: dataFromGetClosestStopFunction["data"]["stops"][i]["id"],
            busStopAddress: dataFromGetClosestStopFunction["data"]["stops"][i]["name"]
        };

        closestStopArray.push(closestStop)

    }


    markerOnMap(userLocation1, closestStopArray[0], closestStopArray[1])
    //locationOnMap(longitudeOnMap, latitudeOnMap, 19, true, true, busStopID, busStopAddress)

    document.getElementById("result").innerText = "Select a station from above dropdown to see the schedule";

}


function displaySchedule() {

    var list = document.getElementById("busstopselectionlist");

    var selectedIndex = list.selectedIndex - 1;

    if (!(selectedIndex == -1)){

        //const proxyurl = "https://cors-anywhere.herokuapp.com/"
        const proxyurl = "https://secret-ocean-49799.herokuapp.com/"

        fetch(proxyurl+ 'http://bustime.mta.info/api/siri/stop-monitoring.json?key='+mtaKey+'&OperatorRef=MTA&MonitoringRef='+closestStopArray[selectedIndex].stopcode)
            .then(res => res.json())
            .then(data => displayData(data, closestStopArray[selectedIndex].stopcode))
            .catch(error => document.getElementById("result").innerText = "No buses available at the loolllll time")

    }
    else {
        document.getElementById("result").innerText = "Select a station from above dropdown to see the schedule";
    }


}

function displayData(data, stopcode) {


    list = data["Siri"]["ServiceDelivery"]["StopMonitoringDelivery"][0]["MonitoredStopVisit"]

    var buses = []

    displayTextArray = []

    if (list == undefined || list.length == 0) {
        appendText = "No buses available at the current time"
        displayTextArray.push(appendText)
    } else {

        for (var i = 0; i < list.length; i++) {
            myBus = new bus()
            myBus.route = list[i]["MonitoredVehicleJourney"]['PublishedLineName']
            myBus.destination = list[i]["MonitoredVehicleJourney"]['DestinationName']
            myBus.eta = list[i]["MonitoredVehicleJourney"]["MonitoredCall"]["ExpectedArrivalTime"]
            buses.push(myBus)
        }

        for (var i = 0; i < buses.length; i++) {
            try {
                var etaTime = buses[i].eta.substring(11, 16)
                appendText = " "
                appendText += "Line Route: " + buses[i].route + "\n"
                appendText += "Final Destination: " + buses[i].destination + "\n"
                appendText += "ETA: " + etaTime + "\n\n"
                displayTextArray.push(appendText)
            } catch {
                break
            }
        }
    }

    displayText = "" + "\n"
    for(var i = 0; i < displayTextArray.length; i++){

        displayText += displayTextArray[i] + "\n"

    }

    document.getElementById("result").innerText = displayText
}

function checkPwd(){
    if(document.getElementById('pwd').value != document.getElementById('repwd').value){
        document.getElementById('message').innerHTML="password don't match";
    }
    else{
        document.getElementById('message').innerHTML="";
    }
}
