export function crearCapaSuelo() {
  return fetch('/js/hiba_suelo_latest.json')
    .then(r => r.json())
    .then(datos => {
      var layer = L.layerGroup();
      datos.forEach(function(d) {
        var hace = Math.round((Date.now() - new Date(d.ts)) / 3600000);
        var color = d.tipo === 'Suelo I' ? '#92400e' : d.tipo === 'Suelo II' ? '#a16207' : '#854d0e';
        L.circleMarker([d.lat, d.lon], {
          radius: 7, fillColor: color, color: '#fff',
          weight: 2, opacity: 1, fillOpacity: 0.9
        }).bindPopup(
          '<b>' + d.tipo + ' - ' + d.id + '</b><br><small style="color:#6b7280">HIBA UCO - Campo</small><br><br>' +
          (d.humidity01 ? '<b>Humedad 1:</b> ' + d.humidity01.toFixed(1) + '%<br>' : '') +
          (d.humidity02 ? '<b>Humedad 2:</b> ' + d.humidity02.toFixed(1) + '%<br>' : '') +
          (d.humidity03 ? '<b>Humedad 3:</b> ' + d.humidity03.toFixed(1) + '%<br>' : '') +
          (d.temperature01 ? '<b>Temp suelo:</b> ' + d.temperature01.toFixed(1) + 'C<br>' : '') +
          (d.ec ? '<b>EC:</b> ' + d.ec.toFixed(3) + ' dS/m<br>' : '') +
          (d.psi ? '<b>PSI:</b> ' + d.psi + ' cbar<br>' : '') +
          '<b>Bateria:</b> ' + d.battery.toFixed(2) + 'V<br>' +
          '<small style="color:#9ca3af">Hace ' + hace + 'h - HIBA UCO</small>'
        ).addTo(layer);
      });
      return layer;
    });
}
