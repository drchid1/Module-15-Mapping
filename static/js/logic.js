// Defining the URL for the GeoJSON data - All Earthquakes in the past 7 days
const url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

/* Function to get the colour based on the depth of the earthquake
The colours were chosen using a colour palette from the internet */
function getColor(depth) {
    if (depth < 10) {
        return '#83ed26'; // Lime Green Colour
    } else if (depth < 30) {
        return '#bbed26'; // Yellow-Green Colour
    } else if (depth < 50) {
        return '#ede026'; // Lemon Yellow Colour
    } else if (depth < 70) {
        return '#edb126'; // Orange-Yellow Colour
    } else if (depth < 90) {
        return '#ed9426'; // Bright Orange Colour
    } else {
        return '#ed3d26'; // Bright Red Colour
    }
}

// Function to get the marker size based on the magnitude of the earthquake
function markerSize(mag) {
  return mag * 3;
}

// Use D3 to load the GeoJSON data
d3.json(url).then(function(data) {
  // Create an empty array to hold the coordinates
  let eqPoints = [];

  /* Loop through the data to get the coordinates
  and save them in the eqPoints array */
  data.features.forEach(function(feature) {
    eqPoints.push([
        feature.geometry.coordinates[1],
        feature.geometry.coordinates[0],
        feature.geometry.coordinates[2],
        feature.properties.mag,
        feature.properties.title,
        feature.properties.place,
        feature.properties.time
    ]);

  });

  // Create a map using Leaflet
  const myMap = L.map("map").setView([37.8, -96], 4);

  // Add a tile layer to the map using OpenStreetMap
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(myMap);

  /* Loop through the coordinates array and add a circle marker for each
  coordinate and bind a popup with the title, place and time of the earthquake */
  eqPoints.forEach(function(info) {
    let [lat, lon, depth, mag, title, place, time] = info;
    L.circleMarker([lat,lon], {
      radius: markerSize(mag),
      fillColor: getColor(depth),
      color: "black",
      weight: 0.4,
      opacity: 1,
      fillOpacity: 0.8
    }).bindPopup(`<h3>${title}</h3> <hr> <h5>Location: ${place}</h5>
      <h5>Time: ${new Date(time).toLocaleString()}</h5>`).addTo(myMap);
  });


// Position the legend in the bottom right corner
let legend = L.control({position: 'bottomright'});

// Creating the div element for the legend
legend.onAdd = function () {
  let div = L.DomUtil.create('div', 'info legend'),
  legLabels = [-10,10, 30, 50, 70, 90],  // Labels for the legend
  legColours = ['#83ed26', '#bbed26', '#ede026', '#edb126', '#ed9426',
                '#ed3d26']; // Colours for the legend

  // Loop through the labels and generate a coloured square for each label
  for (let i = 0; i < legLabels.length; i++) {
      div.innerHTML +=
        `<i class="square" style="background:${legColours[i]}"></i> ${legLabels[i]}${legLabels[i + 1] ? '&ndash;' + legLabels[i + 1] + '<br>' : '+'}`;
  }
    return div;
};

// Add the legend to the map
legend.addTo(myMap);

});
