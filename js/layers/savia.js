export function crearCapaSavia() {
  return fetch('/js/hiba_savia_latest.json')
    .then(r => r.json())
    .then(d => {
      var layer = L.layerGroup();
      var hace = Math.round((Date.now() - new Date(d.ts)) / 3600000);
      L.circleMarker([d.lat, d.lon], {
        radius: 9, fillColor: '#7c3aed', color: '#fff',
        weight: 2, opacity: 1, fillOpacity: 0.9
      }).bindPopup(
        '<b>Flujo de Savia</b><br><small style="color:#6b7280">HIBA UCO Cordoba</small><br><br>' +
        '<b>HRM interior:</b> ' + d.innerHrm.toFixed(2) + '<br>' +
        '<b>HRM exterior:</b> ' + d.outerHrm.toFixed(2) + '<br>' +
        '<b>MHR interior:</b> ' + d.innerMhr.toFixed(2) + '<br>' +
        '<b>MHR exterior:</b> ' + d.outerMhr.toFixed(2) + '<br>' +
        '<b>Tmax interior:</b> ' + d.innerTmax.toFixed(1) + 'C<br>' +
        '<b>Tmax exterior:</b> ' + d.outerTmax.toFixed(1) + 'C<br>' +
        '<small style="color:#9ca3af">Hace ' + hace + 'h - HIBA UCO</small>'
      ).addTo(layer);
      return layer;
    });
}
