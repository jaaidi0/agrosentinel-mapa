export function crearCapaHIBA() {
  return fetch('/js/hiba_latest.json')
    .then(r => r.json())
    .then(d => {
      var layer = L.layerGroup();
      var hace = Math.round((Date.now() - new Date(d.ts)) / 3600000);
      L.circleMarker([d.lat, d.lon], {
        radius: 9, fillColor: '#3b82f6', color: '#fff', weight: 2, opacity: 1, fillOpacity: 0.9
      }).bindPopup(
        '<b>Estacion Rabanales</b><br><small style="color:#6b7280">HIBA UCO Cordoba</small><br><br>' +
        '<b>Temp:</b> ' + parseFloat(d.temp).toFixed(1) + 'C  <b>HR:</b> ' + d.humidity + '%<br>' +
        '<b>Presion:</b> ' + parseFloat(d.pressure).toFixed(1) + ' hPa<br>' +
        '<b>Viento:</b> ' + d.windVelocity + ' m/s ' + d.windDir + 'grad<br>' +
        '<b>Rad. solar:</b> ' + d.rSolar + ' W/m2<br>' +
        '<small style="color:#9ca3af">Hace ' + hace + 'h - HIBA UCO</small>'
      ).addTo(layer);
      return layer;
    });
}
