export function crearCapaDendrometro() {
  return fetch('/js/hiba_dendrometro_latest.json')
    .then(r => r.json())
    .then(datos => {
      var layer = L.layerGroup();
      datos.forEach(function(d) {
        var hace = Math.round((Date.now() - new Date(d.ts)) / 3600000);
        L.circleMarker([d.lat, d.lon], {
          radius: 8, fillColor: '#b45309', color: '#fff',
          weight: 2, opacity: 1, fillOpacity: 0.9
        }).bindPopup(
          '<b>Dendrometro ' + d.id + '</b><br><small style="color:#6b7280">HIBA UCO - Campo</small><br><br>' +
          '<b>Dendometro:</b> ' + d.dendometer + ' um<br>' +
          '<b>Agua suelo (VWC):</b> ' + (d.vwc ? d.vwc.toFixed(1) + '%' : 'N/D') + '<br>' +
          '<b>Temp interior:</b> ' + d.tempIn + 'C<br>' +
          '<b>Humedad interior:</b> ' + d.humidityIn + '%<br>' +
          '<b>Bateria:</b> ' + d.battery.toFixed(2) + 'V<br>' +
          '<small style="color:#9ca3af">Hace ' + hace + 'h - HIBA UCO</small>'
        ).addTo(layer);
      });
      return layer;
    });
}
