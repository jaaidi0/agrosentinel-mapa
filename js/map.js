// Leaflet-specific glue: owns the map instance and markers.
// Knows nothing about VPD/forecast logic - only consumes view-models.

import { estiloMarcador, renderPopup, renderSinDatos } from './render.js';

export function initMap(center, zoom) {
  var map = L.map('map').setView(center, zoom);
  L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
  }).addTo(map);
  map.on('popupopen', function (e) {
    var wrapper = e.popup._wrapper;
    if (!wrapper) return;
    wrapper.classList.remove('popup-anim');
    void wrapper.offsetWidth;
    wrapper.classList.add('popup-anim');
  });
  return map;
}

function radioPorEstacion(station) {
  return station.badge === 'badge-real' ? 18 : 14;
}

export function crearMarcador(map, station) {
  var marker = L.circleMarker([station.lat, station.lon], {
    radius: radioPorEstacion(station), fillColor: "#888", color: "#fff", weight: 3, fillOpacity: 0.95,
    className: (station.badge === 'badge-real' ? 'marker-live ' : '') + 'marker-depth'
  }).addTo(map);
  marker.bindPopup(renderSinDatos(station.nombre));
  return marker;
}

export function actualizarMarcador(marker, viewModel, conexion) {
  marker.setStyle(estiloMarcador(viewModel));
  marker.setPopupContent(renderPopup(viewModel, conexion));

  var path = marker.getElement ? marker.getElement() : marker._path;
  if (path) {
    path.classList.remove('marker-update');
    void path.offsetWidth;
    path.classList.add('marker-update');
    setTimeout(function () { path.classList.remove('marker-update'); }, 400);
  }
}

// Refreshes the popup's connection-state chip/banner against an already-known
// view-model, without the "new data" flash animation. Used by the periodic
// staleness tick so Activo -> Degradado -> Desconectado transitions show up
// even when no new payload has arrived.
export function actualizarConexionMarcador(marker, viewModel, conexion) {
  if (!viewModel) return;
  marker.setStyle(estiloMarcador(viewModel));
  marker.setPopupContent(renderPopup(viewModel, conexion));
}

export function mostrarError(marker, err) {
  marker.setPopupContent("Error: " + err);
}

export function actualizarTimestampLeyenda(date) {
  var el = document.getElementById('legend-updated');
  if (el) el.textContent = date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
}
