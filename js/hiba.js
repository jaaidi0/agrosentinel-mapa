export function cargarHIBA(map) {
  var lat = 37.922006, lon = -4.716531;
  var marker = L.circleMarker([lat, lon], {
    radius: 9,
    fillColor: '#3b82f6',
    color: '#fff',
    weight: 2,
    opacity: 1,
    fillOpacity: 0.9
  });
  marker.bindPopup(
    '<b>🌡️ Estación Rabanales</b><br>' +
    '<small style="color:#6b7280">Fuente: HIBA · UCO · Córdoba</small><br><br>' +
    '<b>Temp:</b> 26.9°C &nbsp; <b>HR:</b> 38%<br>' +
    '<b>Presión:</b> 1000.4 hPa<br>' +
    '<b>Viento:</b> 6 m/s · 225°<br>' +
    '<b>Rad. solar:</b> 0 W/m²<br><br>' +
    '<small style="color:#9ca3af">Último dato: 2026-07-15 21:54 UTC</small>'
  );
  marker.addTo(map);
}
