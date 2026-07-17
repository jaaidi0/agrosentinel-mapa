import { construirViewModel, umbralesConexion, clasificarConexion } from './logic.js';
import { createDataSource } from './dataSource.js';
import { initMap, crearMarcador, actualizarMarcador, actualizarConexionMarcador, mostrarError, actualizarTimestampLeyenda } from './map.js';
import { initStatusBar, markUpdated, setConnection } from './statusBar.js';
import { initClock } from './clock.js';
import { crearCapaHIBA } from './layers/hiba.js';
import { crearCapaCitriData } from './layers/citridata.js';
import { crearCapaNPK } from './layers/npk.js';
import { crearCapaSavia } from './layers/savia.js';
import { crearCapaDendrometro } from './layers/dendrometro.js';
import { crearCapaSuelo } from './layers/suelo.js';

var STATIONS = [
  { id: 'citri', lat: 37.71, lon: -5.28, nombre: "Sensor citrico", badge: "badge-real", cultivo: "Citrico",
    url: 'https://api.agrosentinel.dev/agricultor/dos-hermanas', pollIntervalMs: 30000 },
  { id: 'dos-hermanas', lat: 37.2828, lon: -5.9220, nombre: "Sensor Dos Hermanas", badge: "badge-real", cultivo: "Olivo",
    url: 'https://api.agrosentinel.dev/agricultor/dos-hermanas', pollIntervalMs: 30000 }
];

initClock('header-clock');
var map = initMap([37.5, -4.6], 8);
initStatusBar(STATIONS);

var lastViewModel = {}, lastUpdateAt = {}, fuenteEnError = {}, erroresDesde = {};
var capaSensores = L.layerGroup().addTo(map);

var registros = STATIONS.map(function(station) {
  var marker = crearMarcador(capaSensores, station);
  var dataSource = createDataSource(station);
  var umbrales = umbralesConexion(station);
  return { station: station, marker: marker, dataSource: dataSource, umbrales: umbrales };
});

Promise.all([crearCapaHIBA(), crearCapaCitriData(), crearCapaNPK(), crearCapaSavia(), crearCapaDendrometro(), crearCapaSuelo()]).then(function(capas) {
  var capaHIBA = capas[0].addTo(map);
  var capaCitri = capas[1].addTo(map);
  var capaNPK = capas[2].addTo(map);
  var capaSavia = capas[3].addTo(map);
  var capaDendro = capas[4].addTo(map);
  var capaSuelo = capas[5].addTo(map);
  L.control.layers(null, {
    'Sensores AgroSentinel': capaSensores,
    'CitriData SIAR': capaCitri,
    'HIBA Meteorologica': capaHIBA,
    'HIBA NPK': capaNPK,
    'HIBA Savia': capaSavia,
    'HIBA Dendrometro': capaDendro,
    'HIBA Suelo': capaSuelo
  }, { collapsed: false, position: 'topright' }).addTo(map);
});



registros.forEach(function(reg) {
  reg.dataSource.start(
    function(payload) {
      var viewModel = construirViewModel(payload, reg.station);
      lastViewModel[reg.station.id] = viewModel;
      lastUpdateAt[reg.station.id] = Date.now();
      fuenteEnError[reg.station.id] = false;
      var conn = clasificarConexion(lastUpdateAt[reg.station.id], reg.umbrales);
      actualizarMarcador(reg.marker, viewModel, conn);
      actualizarTimestampLeyenda(new Date());
      markUpdated(reg.station.id, viewModel.estado);
      setConnection(reg.station.id, conn);
    },
    function() {
      fuenteEnError[reg.station.id] = true;
      var conn = clasificarConexion(lastUpdateAt[reg.station.id], reg.umbrales, null, 'desconectado');
      setConnection(reg.station.id, conn);
      if (lastViewModel[reg.station.id]) {
        actualizarConexionMarcador(reg.marker, lastViewModel[reg.station.id], conn);
      }
    }
  );
});

setInterval(function() {
  registros.forEach(function(reg) {
    var conn = clasificarConexion(lastUpdateAt[reg.station.id], reg.umbrales, null, fuenteEnError[reg.station.id] ? 'desconectado' : null);
    setConnection(reg.station.id, conn);
    if (lastViewModel[reg.station.id]) {
      actualizarConexionMarcador(reg.marker, lastViewModel[reg.station.id], conn);
    }
  });
}, 5000);

