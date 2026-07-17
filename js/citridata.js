export function cargarCitriData(map) {
  fetch('/js/citridata_siar.geojson')
    .then(r => r.json())
    .then(data => {
      L.geoJSON(data, {
        pointToLayer: function(feature, latlng) {
          return L.circleMarker(latlng, {
            radius: 7,
            fillColor: '#f39c12',
            color: '#fff',
            weight: 2,
            opacity: 1,
            fillOpacity: 0.85
          });
        },
        onEachFeature: function(feature, layer) {
          var id = feature.properties.entity_id.split(':').pop();
          layer.bindPopup('<b>🌦️ Estación SIAR</b><br><small>' + id + '</small><br><small style="color:#6b7280">Fuente: CitriData UCO</small>');
        }
      }).addTo(map);
    });
}
