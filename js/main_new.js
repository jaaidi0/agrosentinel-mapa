import { construirViewModel, umbralesConexion, clasificarConexion } from './logic.js';
import { createDataSource } from './dataSource.js';
import { initMap, crearMarcador, actualizarMarcador, actualizarConexionMarcador, mostrarError, actualizarTimestampLeyenda } from './map.js';
import { initStatusBar, markUpdated, setConnection } from './statusBar.js';
import { initClock } from './clock.js';
import { crearCapaHIBA } from './layers/hiba.js';
import { crearCapaCitriData } from './layers/citridata.js';

var STATIONS = [
  {
    id: 'citri', lat: 37.71, lon: -5.28,
    nombre: "Sensor cítrico - dato real", badge: "badge-real", cultivo: "Citrico",
    url: 'https://api.agrosentinel.dev/agricultor/dos-hermanas', pollIntervalMs: 30000
  },
  {
    id: 'dos-hermanas', lat: 37.2828, lon: -5.9220,
    nombre: "Sensor propio - Dos Hermanas", badge: "badge-real", cultivo: "Olivo",
    url: 'https://api.agrosentinel.dev/agricultor/dos-hermanas', pollIntervalMs: 30000
  }
];

initClock('header-clock');
var map = initMap([37.5, -4.6], 8);
initStatusBar(STATIONS);

var lastViewModel = {}, lastUpdateAt = {}, fuenteEnError = {}, erroresDesde = {};
var capaSensores = L.layerGroup().addTo(map);

var registros = STATIONS.map(function(station) {
  var marker = crearMarcador(map, station);
  capaSensores.addLayer(marker);
  var dataSource = createDataSource(station);
  var umbrales = umbralesConexion(station);
  return { station, marker, dataSource, umbrales };
});

Promise.all([crearCapaHIBA(), crearCapaCitriData()]).then(function(capas) {
  var capaHIBA = capas[0].addTo(map);
  var capaCitri = capas[1].addTo(map);

  L.control.layers(null, {
    '🟢 Sensores AgroSentinel': capaSensores,
    '🟠 CitriData SIAR': capaCitri,
    '🔵 HIBA Meteorológica': capaHIBA
  }, { collapsed: false, position: 'topright' }).addTo(map);
});
