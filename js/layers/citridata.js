export function crearCapaCitriData() {
  return fetch('/js/citridata_siar.geojson')
    .then(r => r.json())
    .then(data => {
      var layer = L.layerGroup();
      L.geoJSON(data, {
        pointToLayer: function(f, latlng) {
          return L.circleMarker(latlng, {
            radius: 7, fillColor: '#f39c12', color: '#fff', weight: 2, opacity: 1, fillOpacity: 0.85
          });
        },
        onEachFeature: function(f, l) {
          var id = f.properties.entity_id.split(':').pop();
          l.bindPopup('<b>Estacion SIAR</b><br><small>' + id + '</small><br><small style="color:#6b7280">CitriData UCO</small>');
        }
      }).addTo(layer);
      return layer;
    });
}
