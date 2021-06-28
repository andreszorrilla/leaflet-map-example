var baseLayers = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution:
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  subdomains: ['a', 'b', 'c'],
});

var regionsLayer = L.layerGroup()
var countriesLayer = L.layerGroup()

for (var i = 0; i < point_of_interests.length; ++i) {
  if (point_of_interests[i].regions){
    // If a country supports regions,
    // then a set of green points will be added
    for (var j = 0; j < point_of_interests[i].regions.length; ++j){
      var region = point_of_interests[i].regions[j]
      L.circleMarker([region.lat, region.lng], { radius: region.users / 1000 })
      .setStyle({ 
        color: "green",
        fillColor: 'green',
        fillOpacity: 0.5,
        weight: 0.1,
      })
      .bindPopup(
        "<h4 style='text-align:center;'>" + region.name +
        "</h4> <h4 style='text-align:center;'>" + region.users + "</h4>"
      )
      .addTo(regionsLayer)
    }
  }

  // Add country circles
  L.circleMarker([point_of_interests[i].lat, point_of_interests[i].lng], { radius: point_of_interests[i].users / 800000 })
  .setStyle({ 
    color: "black",
    fillColor: 'red',
    fillOpacity: 0.5,
    weight: 0.1,
  })
  .bindPopup(
    "<h4 style='text-align:center;'>" + point_of_interests[i].name +
    "</h4> <h4 style='text-align:center;'>" + point_of_interests[i].users + "</h4>"
  )
  .addTo(countriesLayer)
}


var map = L.map('map', {
  center: [20.0, 5.0],
  minZoom: 2,
  zoom: 2,
  maxZoom: 5,
  layers: [baseLayers, countriesLayer]
}).on('zoom', function() {
  console.log(map.getZoom())
  if (map.getZoom() === 4){
    map.addLayer(regionsLayer);
  }
  else if (map.getZoom() === 3){    
    map.removeLayer(regionsLayer);
  }
})


L.control.layers({}, 
{
  "Countries": countriesLayer,
  "Regions": regionsLayer
},
{"collapsed": false}
).addTo(map);


// Legend
var legend = L.control({ position: 'bottomright' });
legend.onAdd = function (map) {
  var div = L.DomUtil.create('div', 'map-references legend'),
      magnitude = [1, 2],
      labels = [];

  div.innerHTML += "<h4 style='margin:4px'>Locations</h4>";
  div.innerHTML += '<i style="background:red"></i>Countries<br>';
  div.innerHTML += '<i style="background:lightgreen"></i>Regions';

  return div
}

legend.addTo(map);