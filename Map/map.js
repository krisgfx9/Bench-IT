"use strict";

const myLatLng = {
  lat: 47.425140701693024,
  lng: 9.373167913115545
};

let map; // Declare the map object at a higher scope so it can be accessed by other functions
let directionsService = new google.maps.DirectionsService();
let directionsRenderer = new google.maps.DirectionsRenderer();

function initMap() {
  //const directionsService = new google.maps.DirectionsService();
  map = new google.maps.Map(document.getElementById("gmp-map"), {
    zoom: 15,
    center: myLatLng,
    fullscreenControl: false,
    zoomControl: true,
    streetViewControl: false
  });

  // Create a marker for "My Location"
  new google.maps.Marker({
    position: myLatLng,
    map,
    title: "My location"
  });

  document.getElementById("getDirectionsButton").addEventListener("click", function () {
    const origin = document.getElementById("destination").value; // Get the origin from the input field
    let directionsService = new google.maps.DirectionsService();
    let directionsRenderer = new google.maps.DirectionsRenderer();
    calculateAndDisplayRoute(directionsService, directionsRenderer, origin);
  });

  document.getElementById("showLocationButton").addEventListener("click", showCurrentLocation);
  // You can call a function here to create and display benches
  createAndDisplayBenches();
}

// function createAndDisplayBenches() {
//   function createBench(lat, lng, title) {
//     return {
//       position: { lat, lng },
//       title
//     };
//   }
  
//   const Benches = [
//     createBench(47.42214745104411, 9.412074940105018, "Bench 1"),  // this sets the value of the bench which will be located on the map
//     createBench(47.42214482048657, 9.412063266484564, "Bench 2"),
//     createBench(47.41828156965881, 9.349421812047016, "Bench 3"),
//     createBench(47.41828156965881, 9.349421812047016, "Bench 3"),
//     createBench(47.420546885052325, 9.351490423933113, "Bench 4"),
//     createBench(47.41609518324315, 9.349432376031642, "Bench 5"),
//     createBench(47.41557872763701, 9.35284763916906, "Bench 6"),
//     createBench(47.416881808713, 9.350140846584294, "Bench 7"),
//     createBench(47.42051178199691, 9.400107162841703, "Bench 9"),
//     createBench(47.42032169964099, 9.383739002463876, "Bench 10"),
//     createBench(47.42017641703657, 9.383864202773397, "Bench 11"),
//     createBench(47.422477372894036, 9.375972096143263, "Bench 12"),
//     createBench(47.42037765386127, 9.3594527320304, "Bench 13"),
//     createBench(47.420475787835954, 9.359717370455884, "Bench 14"),
//     createBench(47.42057667138908, 9.359987728410985, "Bench 15"),
//     createBench(47.42066870292529, 9.360244495028274, "Bench 16"),
//     createBench(47.42074223763939, 9.360551744169872, "Bench 17"),
//     createBench(47.42077308258762, 9.360923441182855, "Bench 18"),
//     createBench(47.42080683326405, 9.361237823904348, "Bench 19"),
//   ];

//   for (let i = 0; i < Benches.length; i++) {
//     const benchIcon = new google.maps.Marker({
//       position: Benches[i].position,
//       title: Benches[i].title,
//       map: map,
//       icon: {
//         url: "https://cdn.discordapp.com/attachments/937183890601287680/1149000743433547826/bench.png",
//         scaledSize: new google.maps.Size(38, 38),
//       },
//     });
//   }
  
// }

function createAndDisplayBenches() {
  function createBench(lat, lng, title) {
    return {
      position: { lat, lng },
      title,
    };
  }

  const Benches = [ //an array that hold the value/coordinates of the benches
    createBench(47.42214745104411, 9.412074940105018, "Bench 1"),  // this sets the value of the bench which will be located on the map
    createBench(47.42214482048657, 9.412063266484564, "Bench 2"),
    createBench(47.41828156965881, 9.349421812047016, "Bench 3"),
    createBench(47.41828156965881, 9.349421812047016, "Bench 3"),
    createBench(47.420546885052325, 9.351490423933113, "Bench 4"),
    createBench(47.41609518324315, 9.349432376031642, "Bench 5"),
    createBench(47.41557872763701, 9.35284763916906, "Bench 6"),
    createBench(47.416881808713, 9.350140846584294, "Bench 7"),
    createBench(47.42051178199691, 9.400107162841703, "Bench 9"),
    createBench(47.42032169964099, 9.383739002463876, "Bench 10"),
    createBench(47.42017641703657, 9.383864202773397, "Bench 11"),
    createBench(47.422477372894036, 9.375972096143263, "Bench 12"),
    createBench(47.42037765386127, 9.3594527320304, "Bench 13"),
    createBench(47.420475787835954, 9.359717370455884, "Bench 14"),
    createBench(47.42057667138908, 9.359987728410985, "Bench 15"),
    createBench(47.42066870292529, 9.360244495028274, "Bench 16"),
    createBench(47.42074223763939, 9.360551744169872, "Bench 17"),
    createBench(47.42077308258762, 9.360923441182855, "Bench 18"),
    createBench(47.42080683326405, 9.361237823904348, "Bench 19"),
  ];

  const benchMarkers = [];

  for (let i = 0; i < Benches.length; i++) {
    const benchIcon = new google.maps.Marker({
      position: Benches[i].position,
      title: Benches[i].title,
      icon: {
        url: "https://cdn.discordapp.com/attachments/937183890601287680/1149000743433547826/bench.png",
        scaledSize: new google.maps.Size(38, 38),
      },
    });

    benchMarkers.push(benchIcon);
  }

  // Create a MarkerClusterer to group the markers
  new MarkerClusterer(map, benchMarkers, {
    imagePath: "https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m",

  });
}



function showCurrentLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function (position) {
      const myLat = position.coords.latitude;
      const myLong = position.coords.longitude;
      const coords = new google.maps.LatLng(myLat, myLong);

      // Center the map on the user's location
      map.setCenter(coords);

      // Create a marker for the user's location
      const userLocationMarker = new google.maps.Marker({
        map: map,
        position: coords,
        title: "My Location"
      });

      
    }, function (error) {
      // Handle s geolocation errors here
      switch (error.code) {
        case error.PERMISSION_DENIED:
          alert("User denied the request for geolocation.");
          break;
        case error.POSITION_UNAVAILABLE:
          alert("Location information is unavailable.");
          break;
        case error.TIMEOUT:
          alert("The request to get user location timed out.");
          break;
        case error.UNKNOWN_ERROR:
          alert("An unknown error occurred.");
          break;
      }
    });
  } else {
    alert("Geolocation is not supported by this browser.");
  }
}



// document.addEventListener("DOMContentLoaded", function () {
//   // Your code here, including the event listener
//   document.getElementById("getDirectionsButton").addEventListener("click", function () {
//     console.log("Button clicked!");
//     calculateAndDisplayRoute(directionsService, directionsRenderer);
//   });
// });


// // Modify the calculateAndDisplayRoute function
// function calculateAndDisplayRoute(directionsService, directionsRenderer) {
//   const selectedMode = document.getElementById("mode").value; // Use "value" instead of "ariaValueMax"

  

//   directionsService.route({
//     origin: document.getElementById("from").value, // Use the value from the input field
//     destination: "Bench 3", // Hardcoded destination as "Bench 3"
//     travelMode: google.maps.TravelMode[selectedMode],
//   })
//     .then((response) => {
//       directionsRenderer.setDirections(response);
//     })
//     .catch((e) => window.alert("Direction Request Has Failed" + e.message));
// }

function calculateAndDisplayRoute(directionsService, directionsRenderer, origin) {
  const selectedMode = document.getElementById("mode").value; // Get the selected travel mode
  directionsService.route({
    origin: origin, // Use the origin provided as an argument
    destination: "Bench 3", // Hardcoded destination as "Bench 3"
    travelMode: selectedMode, // Use the selected travel mode
  })
    .then((response) => {
      directionsRenderer.setDirections(response);
    })
    .catch((e) => window.alert("Direction Request Has Failed: " + e.message));
}



// You can call the initMap function here if you want to initialize the map when the page loads
initMap();