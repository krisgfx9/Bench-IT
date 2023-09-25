"use strict";

const myLatLng = {
  lat: 47.425140701693024,
  lng: 9.373167913115545
};

let map;
let directionsService;
let directionsRenderer;

// Define the createBench function at the top level
function createBench(lat, lng, title) {
  return {
    position: { lat, lng },
    title,
  };
}

const benchCoordinates = {
  "Bench 1": { lat: 47.42214745104411, lng: 9.412074940105018 },
  "Bench 2": { lat: 47.42214482048657, lng: 9.412063266484564 },
  "Bench 3": { lat: 47.41828156965881, lng: 9.349421812047016 },
  // Add coordinates for other benches here
};


function initMap() {
  map = new google.maps.Map(document.getElementById("gmp-map"), {
    zoom: 15,
    center: myLatLng,
    fullscreenControl: false,
    zoomControl: true,
    streetViewControl: false
  });

  directionsService = new google.maps.DirectionsService();
  directionsRenderer = new google.maps.DirectionsRenderer();
  directionsRenderer.setMap(map);

  // Create a marker for "My Location"
  new google.maps.Marker({
    position: myLatLng,
    map,
    title: "My location"
  });

  // Create an autocomplete object for the origin input field
  const originAutocomplete = new google.maps.places.Autocomplete(document.getElementById('destination'));

  // Set the types to restrict autocomplete suggestions to addresses only
  originAutocomplete.setTypes(['address']);

  // Add event listeners for the buttons
  document.getElementById("getDirectionsButton").addEventListener("click", function () {
    const origin = document.getElementById("destination").value;
    const mode = document.getElementById("mode").value;
    const destinationCoords = { lat: 47.41828156965881, lng: 9.349421812047016 };

    if (!origin.trim()) {
      alert("Please enter a valid origin address.");
      return;
    }

    console.log("Calculating route with origin:", origin, "and mode:", mode);
    calculateAndDisplayRoute(origin, mode, destinationCoords);
  });

  document.getElementById("showLocationButton").addEventListener("click", showCurrentLocation);

  // You can call a function here to create and display benches
  createAndDisplayBenches();
}

function createAndDisplayBenches() {
  const benchMarkers = [];

  // Loop through benchCoordinates object keys (bench titles)
  for (const title in benchCoordinates) {
    if (benchCoordinates.hasOwnProperty(title)) {
      const bench = benchCoordinates[title];
      const benchIcon = new google.maps.Marker({
        position: new google.maps.LatLng(bench.lat, bench.lng),
        title: title,
        icon: {
          url: "https://cdn.discordapp.com/attachments/937183890601287680/1149000743433547826/bench.png",
          scaledSize: new google.maps.Size(38, 38),
        },
      });

      benchMarkers.push(benchIcon);
    }
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
      // Handle geolocation errors here
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

function calculateAndDisplayRoute(selectedBenchTitle, mode) {
  const originCoords = myLatLng;
  const destinationCoords = benchCoordinates[selectedBenchTitle];

  if (!destinationCoords) {
    alert("Please select a valid destination bench.");
    return;
  }

  directionsService.route({
    origin: originCoords,
    destination: new google.maps.LatLng(destinationCoords.lat, destinationCoords.lng),
    travelMode: google.maps.TravelMode[mode],
  })
  .then((response) => {
    directionsRenderer.setDirections(response);
    console.log("Directions response:", response);
  })
  .catch((e) => {
    console.error("Direction Request Has Failed:", e.message);
    if (e.message.includes("ZERO_RESULTS")) {
      alert("No results found for the destination bench. Please check the bench title.");
    } else {
      alert("Direction Request Has Failed: " + e.message);
    }
  });
}

// You can call the initMap function here if you want to initialize the map when the page loads
initMap();