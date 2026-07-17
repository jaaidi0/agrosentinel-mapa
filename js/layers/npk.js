export function crearCapaNPK() {
  return fetch('/js/hiba_npk_latest.json')
    .then(r => r.json())
    .then(d => {
      var layer = L.layerGroup();
      var hace = Math.round((Date.now() - new Date(d.ts)) / 3600000);
      L.circleMarker([d.lat, d.lon], {
        radius: 9, fillColor: '#16a34a', color: '#fff',
        weight: 2, opacity: 1, fillOpacity: 0.9
      }).bindPopup(
        '<b>NPK Sensor</b><br><small style="color:#6b7280">HIBA UCO Cordoba</small><br><br>' +
        '<b>N:</b> ' + d.nitrogen + ' mg/kg <b>P:</b> ' + d.phosphorous + ' mg/kg <b>K:</b> ' + d.potassium + ' mg/kg<br>' +
        '<b>Temp suelo:</b> ' + d.temperature + 'C<br>' +
        '<b>Humedad:</b> ' + d.humidity.toFixed(1) + '%<br>' +
        '<b>EC:</b> ' + d.ec + ' uS/cm<br>' +
        '<small style="color:#9ca3af">Hace ' + hace + 'h - HIBA UCO</small>'
      ).addTo(layer);
      return layer;
    });
}
